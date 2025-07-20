import Joi from "joi";
import { RegisterUserBody, LoginUserBody } from "../types/app.types.ts";

export const registerSchema = Joi.object<RegisterUserBody>({
  fullName: Joi.string().trim()
    .min(3)
    .max(255)
    .required()
    .messages({
      "string.base": "ФИО должно быть строкой.",
      "string.empty": "ФИО не может быть пустым.",
      "string.min": "ФИО должно содержать минимум {#limit} символа.",
      "string.max": "ФИО должно содержать максимум {#limit} символов.",
      "any.required": "ФИО обязательно.",
    }),
  dateOfBirth: Joi.date().iso()
    .required()
    .messages({
      "date.base": "Дата рождения должна быть датой.",
      "date.format": "Дата рождения должна быть в формате ISO (YYYY-MM-DD).",
      "any.required": "Дата рождения обязательна.",
    }),
  email: Joi.string().trim()
    .email()
    .required()
    .messages({
      "string.base": "Email должен быть строкой.",
      "string.empty": "Email не может быть пустым.",
      "string.email": "Email должен быть валидным адресом электронной почты.",
      "any.required": "Email обязателен.",
    }),
  password:
    Joi.string()
      .min(6)
      .required()
      .messages({
        "string.base": "Пароль должен быть строкой.",
        "string.empty": "Пароль не может быть пустым.",
        "string.min": "Пароль должен содержать минимум {#limit} символов.",
        "any.required": "Пароль обязателен.",
      }),
});

export const loginSchema = Joi.object<LoginUserBody>({
  email: Joi.string().trim()
    .email()
    .required()
    .messages({
      "string.base": "Email должен быть строкой.",
      "string.empty": "Email не может быть пустым.",
      "string.email": "Email должен быть валидным адресом электронной почты.",
      "any.required": "Email обязателен.",
    }),
  password: Joi.string()
    .required()
    .messages({
      "string.base": "Пароль должен быть строкой.",
      "string.empty": "Пароль не может быть пустым.",
      "any.required": "Пароль обязателен.",
    }),
});
