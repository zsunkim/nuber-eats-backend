import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { RestaurantsModule } from './restaurants/restaurants.module';
import * as Joi from 'joi';
import { Restaurant } from './restaurants/entities/restaurants.entity';
import { CommonModule } from './common/common.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { JwtModule } from './jwt/jwt.module';
import { JwtMiddleware } from './jwt/jwt.middleware';
import { Verification } from './users/entities/verification.entity';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === "dev" ? ".env.dev" : ".dev.test",
      ignoreEnvFile: process.env.NODE_ENV === "prod",
      // 내가 원하는 모든 환경 변수의 유효성을 검사할 수 있음.
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'test', 'prod').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        SECRET_KEY: Joi.string().required(),
        MAILGUN_API_KEY: Joi.string().required(),
        MAILGUN_DOMAIN_NAME: Joi.string().required(),
        MAILGUN_FROM_EMAIL: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: process.env.NODE_ENV !== "prod", // database를 모듈의 현재 상태로 마이그래이션
      logging: process.env.NODE_ENV !== "prod", // database에서 일어나는 것을 콘솔로 표시
      entities: [User, Verification]
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      context: ({ req }) => ({ user: req['user'] })
    }),
    JwtModule.forRoot({
      privateKey: process.env.SECRET_KEY,
    }),
    UsersModule,
    MailModule.forRoot({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN_NAME,
      fromEmail: process.env.MAILGUN_FROM_EMAIL,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // JwtMiddleware를 forRoutes()를 통해서 path 경로에 method일 경우에만 적용시킴
    consumer.apply(JwtMiddleware).forRoutes({
      path: "/graphql",
      method: RequestMethod.ALL,
    });
  }
}