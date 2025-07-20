import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";
import { UserRole } from "../types/app.types.ts";

@Entity()
@Unique(["email"])
export class User {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({ type: "varchar", length: 255 })
  fullName!: string;

  @Column({ type: "date" })
  dateOfBirth!: Date;

  @Column({ type: "varchar", length: 255 })
  email!: string;

  @Column({ type: "varchar", length: 255 })
  password!: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.User,
  })
  role!: UserRole;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;
}
