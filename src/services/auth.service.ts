import AppError from "../errors/AppError";
import { transport } from "../config/nodemailer";
import { hashPassword } from "../utils/hash";
import { prisma } from "../config/prisma";

export const registerService = async (data: any) => {
  const { username, email, password, role } = data;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new AppError("User already exist", 400);
  }

  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      password: await hashPassword(password),
      role: role || "admin",
    },
  });

  await transport.sendMail({
    from: process.env.MAILSENDER,
    to: newUser.email,
    subject: "Verify Registration Account",
    html: `<h1>Thank you for register account ${newUser.username}</h1>`,
  });

  return newUser;
};
