import { User } from "../../prisma/generated/client";
import { prisma } from "../config/prisma";

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const createUser = async (data: User) => {
  return prisma.user.create({
    data,
  });
};
