import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateAccountInput } from "./dtos/create-account.dto";
import { LoginInput } from "./dtos/login.dto";
import { User } from "./entities/user.entity";
import { JwtService } from "src/jwt/jwt.service";
import { EditProfileInput } from "./dtos/edit-profile.dto";
import { Verification } from "./entities/verification.entity";

export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
    private readonly jwtService: JwtService,
  ) { }

  async createAccount({ email, password, role }: CreateAccountInput): Promise<{ ok: boolean, error?: string }> {
    // 유저 확인 -> 없으면 유저 생성 & 비밀번호 hash
    try {
      const exists = await this.userRepository.findOne({ email });
      if (exists) {
        return { ok: false, error: '이미 존재하는 이메일입니다.' };
      }
      const user = await this.userRepository.save(this.userRepository.create({ email, password, role }));
      await this.verifications.save(this.verifications.create({ user }));
      return { ok: true };
    } catch (error) {
      console.log(error);
      return { ok: false, error: '생성 실패' };
    }
  }

  async login({ email, password }: LoginInput): Promise<{ ok: boolean; error?: string, token?: string }> {
    try {
      const user = await this.userRepository.findOne({ email }, { select: ['password'] });
      if (!user) {
        return {
          ok: false,
          error: 'User not found',
        };
      }
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: 'Wrong password',
        };
      }
      const token = this.jwtService.sign({ id: user.id });
      return {
        ok: true,
        token,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findOne({ id });
  }

  async editProfile(
    userId: number,
    { email, password }: EditProfileInput,
  ): Promise<User> {
    const user = await this.userRepository.findOne(userId);
    if (email) {
      user.email = email;
      user.verified = false;
      await this.verifications.save(this.verifications.create({ user }));
    }
    if (password) {
      user.password = password;
    }
    return this.userRepository.save(user);
  }

  async verifyEmail(code: string): Promise<boolean> {
    try {
      const verification = await this.verifications.findOne(
        { code },
        { relations: ['user'] },
      );
      if (verification) {
        verification.user.verified = true;
        console.log(verification.user);
        this.userRepository.save(verification.user);
        return true;
      }
      throw new Error();
    } catch (e) {
      console.log(e);
      return false;
    }
  }


}