import { Field, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { Column, Entity } from "typeorm";

enum UserRole {
  Client,
  Wwner,
  Delivery
}

registerEnumType(UserRole, { name: "UserRole" })

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column()
  @Field(type => String)
  email: string;

  @Column()
  @Field(type => String)
  password: string;

  @Column({ type: 'enum', enum: UserRole }) // 데이터베이스에는 type이 enum인 UserRole
  @Field(type => UserRole) // type이 UserRole인 graphQL
  role: UserRole;
}