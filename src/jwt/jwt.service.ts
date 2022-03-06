import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from './jwt.constants';
import { JwtModuleOptions } from './jwt.interfaces';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions, // configService로도 사용가능
  ) { }

  sign(payload: object): string {
    console.log(payload);
    return jwt.sign(payload, this.options.privateKey);
  }
}
