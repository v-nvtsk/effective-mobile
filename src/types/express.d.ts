import { UserRole } from "./app.types.ts";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
        email: string;
      };
    }
  }
}
