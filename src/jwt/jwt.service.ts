import { Inject, Injectable } from '@nestjs/common';
import { JwtModuleOptions } from './jwt.interfaces';
import * as jwt from 'jsonwebtoken';
import { CONFIG_OPTIONS } from 'src/common/entities/common.constants';

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions, // configService로도 사용가능
  ) { }

  sign(payload: object): string {
    console.log(payload);
    return jwt.sign(payload, this.options.privateKey);
  }

  verify(token: string) {
    console.log(token);
    return jwt.verify(token, this.options.privateKey);
  }
}
