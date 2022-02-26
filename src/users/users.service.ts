import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { createAccountInput } from "./dtos/create-account.dto";
import { User } from "./entities/user.entity";

export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User>,
  ) { }

  async createAccount({ email, password, role }: createAccountInput): Promise<[boolean, string?]> {
    // 유저 확인 -> 없으면 유저 생성 & 비밀번호 hash
    try {
      const exists = await this.user.findOne({ email });
      if (exists) {
        return [false, '이미 존재하는 이메일입니다.'];
      }
      await this.user.save(this.user.create({ email, password, role }));
      return [true]
    } catch (error) {
      console.log(error);
      return [false, '생성 실패'];
    }

  }
}