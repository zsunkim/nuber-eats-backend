import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { UsersService } from "src/users/users.service";
import { JwtService } from "./jwt.service";

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) { }

  async use(req: Request, res: Response, next: NextFunction) {
    console.log(req.headers);
    if ("x-jwt" in req.headers) {
      console.log(req.headers['x-jwt']);
      const token = req.headers['x-jwt'];
      const decoded = this.jwtService.verify(token.toString());
      if (typeof decoded === "object" && decoded.hasOwnProperty('id')) {
        try {
          const user = await this.userService.findById(decoded['id']);
          req['user'] = user;
        } catch (error) {
          console.log(error);
          throw new Error(error);
        }
      }
    }
    next();
  }
}