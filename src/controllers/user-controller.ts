import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { HttpError } from "../utils/errors.ts";
import {
  UserPublicData,
  UserRole,
} from "../types/app.types.ts";
import * as userRepository from "../repositories/user-repository.ts";
import { registerSchema, loginSchema } from "../validations/user-validation.ts";

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validationResult = registerSchema.validate(req.body);
    const { error } = validationResult;
    if (error) {
      throw new HttpError(error.details[0].message, 400);
    }
    const { value } = validationResult;

    const { fullName, dateOfBirth, email, password } = value;

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new HttpError("Пользователь с таким email уже существует.", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userRepository.createUser({
      fullName,
      dateOfBirth: new Date(dateOfBirth),
      email,
      password: hashedPassword,
      role: UserRole.User,
      isActive: true,
    });

    const userResponse: UserPublicData = {
      id: newUser.id,
      fullName: newUser.fullName,
      dateOfBirth: newUser.dateOfBirth,
      email: newUser.email,
      role: newUser.role,
      isActive: newUser.isActive,
    };

    res.status(201).json({
      message: "Пользователь успешно зарегистрирован.",
      user: userResponse,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validationResult = loginSchema.validate(req.body);
    const { error } = validationResult;
    if (error) {
      throw new HttpError(error.details[0].message, 400);
    }
    const { value: { email, password } } = validationResult;

    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new HttpError("Неверные учетные данные.", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpError("Неверные учетные данные.", 401);
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" },
    );

    const userResponse: UserPublicData = {
      id: user.id,
      fullName: user.fullName,
      dateOfBirth: user.dateOfBirth,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    };

    res.status(200).json({
      message: "Успешный вход.",
      token,
      user: userResponse,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userRepository.findAll();

    const usersResponse: UserPublicData[] = users.map((user) => ({
      id: user.id,
      fullName: user.fullName,
      dateOfBirth: user.dateOfBirth,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    }));

    res.status(200).json(usersResponse);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await userRepository.findById(id);

    if (!user) {
      throw new HttpError("Пользователь не найден.", 404);
    }

    const userResponse: UserPublicData = {
      id: user.id,
      fullName: user.fullName,
      dateOfBirth: user.dateOfBirth,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    };

    res.status(200).json(userResponse);
  } catch (error) {
    next(error);
  }
};

export const blockUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userToBlock = await userRepository.findById(id);

    if (!userToBlock) {
      throw new HttpError("Пользователь не найден.", 404);
    }

    if (userToBlock.role === UserRole.Admin) {
      throw new HttpError("Невозможно заблокировать администратора.", 403);
    }

    const updatedUser = await userRepository.updateUser(id, { isActive: false });

    if (!updatedUser) {
      throw new HttpError("Ошибка при обновлении пользователя.", 500);
    }

    const userResponse: UserPublicData = {
      id: updatedUser.id,
      fullName: updatedUser.fullName,
      dateOfBirth: updatedUser.dateOfBirth,
      email: updatedUser.email,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
    };

    res.status(200).json({
      message: "Пользователь успешно заблокирован.",
      user: userResponse,
    });
  } catch (error) {
    next(error);
  }
};
