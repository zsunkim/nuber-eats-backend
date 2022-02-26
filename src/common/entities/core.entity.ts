import { Field } from "@nestjs/graphql";
import { CreateDateColumn, PrimaryColumn, UpdateDateColumn } from "typeorm";

export class CoreEntity {
  @PrimaryColumn()
  @Field(type => String)
  id: number;

  @CreateDateColumn()
  @Field(type => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(type => Date)
  updatedAt: Date;
}