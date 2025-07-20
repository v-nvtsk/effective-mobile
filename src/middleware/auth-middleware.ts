import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HttpError } from "../utils/errors.ts";
import { UserRole } from "../types/app.types.ts";

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return next(new HttpError("Отсутствует токен аутентификации.", 401));
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET environment variable is not defined!");
      throw new Error("Server configuration error.");
    }

    const decoded = jwt.verify(token, secret) as { userId: string; role: UserRole; email: string };

    if (!Object.values(UserRole).includes(decoded.role)) {
      return next(new HttpError("Недопустимая роль пользователя.", 403));
    }

    req.user = {
      id: decoded.userId,
      role: decoded.role,
      email: decoded.email,
    };

    next();
  } catch (error: unknown) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new HttpError("Неверный или просроченный токен.", 403));
    }
    next(new HttpError("Ошибка аутентификации.", 500));
  }
};

export const authorizeRoles = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;

    if (!user) {
      return next(new HttpError("Ошибка аутентификации: пользователь не авторизован.", 401));
    }
    if (!roles.includes(user.role)) {
      return next(new HttpError("Недостаточно прав для выполнения операции.", 403));
    }

    next();
  };
};

export const isOwnerOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { user } = req;

  if (!user || !user.id || !user.role) {
    return next(new HttpError("Ошибка аутентификации: информация о пользователе недоступна.", 401));
  }

  if (user.role === UserRole.Admin || String(user.id) === String(id)) {
    return next();
  }

  return next(new HttpError("Недостаточно прав для выполнения операции.", 403));
};
