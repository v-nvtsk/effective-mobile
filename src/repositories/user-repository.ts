import { User } from "../models/user.ts";
import { AppDataSource } from "../data-source.ts";

const userRepository = AppDataSource.getRepository(User);

export const findByEmail = async (email: string) => {
  return userRepository.findOneBy({ email });
};

export const findById = async (id: string) => {
  return userRepository.findOneBy({ id });
};

export const findAll = async () => {
  return userRepository.find();
};

export const createUser = async (userData: Partial<User>) => {
  const user = userRepository.create(userData);
  return userRepository.save(user);
};

export const updateUser = async (id: string, updates: Partial<User>) => {
  await userRepository.update(id, updates);
  return findById(id);
};

export default {
  findByEmail,
  findById,
  findAll,
  createUser,
  updateUser,
};
