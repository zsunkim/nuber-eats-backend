import { CreateDateColumn, PrimaryColumn, UpdateDateColumn } from "typeorm";

export class CoreEntity {
  @PrimaryColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}