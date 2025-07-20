import { User } from "../models/user.ts";

export const UserRole = {
  Admin: "admin",
  User: "user",
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export type UserPublicData = Omit<User, "password">;

export interface RegisterUserBody {
  fullName: string;
  dateOfBirth: string;
  email: string;
  password: string;
}

export interface LoginUserBody {
  email: string;
  password: string;
}
