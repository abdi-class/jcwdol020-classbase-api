import { User } from "../../prisma/generated/client";
import { prisma } from "../config/prisma";

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

type CreateUserType = Omit<
  User,
  "id" | "imgProfile" | "createdAt" | "updatedAt"
>;

export const createUser = async (data: CreateUserType) => {
  return prisma.user.create({
    data,
  });
};

export const updateUser = async (data: Partial<User>, id: number) => {
  return prisma.user.update({
    data,
    where: {
      id,
    },
  });
};
