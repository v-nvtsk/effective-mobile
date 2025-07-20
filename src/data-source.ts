import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./models/user.ts";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  username: process.env.DB_USER || "user",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "effective_mobile_db",
  synchronize: true,
  logging: process.env.NODE_ENV === "development" ? ["query", "error"] : false,
  entities: [User],
  migrations: [],
  subscribers: [],
});
