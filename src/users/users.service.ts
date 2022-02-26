import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateAccountInput } from "./dtos/create-account.dto";
import { LoginInput } from "./dtos/login.dto";
import { User } from "./entities/user.entity";

export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async createAccount({ email, password, role }: CreateAccountInput): Promise<{ ok: boolean, error?: string }> {
    // 유저 확인 -> 없으면 유저 생성 & 비밀번호 hash
    try {
      const exists = await this.userRepository.findOne({ email });
      if (exists) {
        return { ok: false, error: '이미 존재하는 이메일입니다.' };
      }
      await this.userRepository.save(this.userRepository.create({ email, password, role }));
      return { ok: true };
    } catch (error) {
      console.log(error);
      return { ok: false, error: '생성 실패' };
    }
  }

  async login({ email, password }: LoginInput): Promise<{ ok: boolean; error?: string, token?: string }> {
    try {
      const user = await this.userRepository.findOne({ email });
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
      return {
        ok: true,
        token: 'testttest',
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}