import AppError from "../errors/AppError";
import { transport } from "../config/nodemailer";
import { hashPassword } from "../utils/hash";
import { prisma } from "../config/prisma";
import {
  createUser,
  findUserByEmail,
  updateUser,
} from "../repositories/user.repository";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { cloudinaryUpload } from "../config/cloudinary";

export const registerService = async (data: any) => {
  const { username, email, password, role } = data;

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new AppError("User already exist", 400);
  }

  const newUser = await createUser({
    username,
    email,
    password: await hashPassword(password),
    role: role || "admin",
  });

  await transport.sendMail({
    from: process.env.MAILSENDER,
    to: newUser.email,
    subject: "Verify Registration Account",
    html: `<h1>Thank you for register account ${newUser.username}</h1>`,
  });

  return newUser;
};

export const loginService = async (data: any) => {
  const findUser = await findUserByEmail(data.email);

  if (!findUser) {
    throw new AppError("User not exist", 404);
  }

  const comparePass = await compare(data.password, findUser.password);
  if (!comparePass) {
    throw new AppError("Password is wrong", 401);
  }

  const token = sign(
    { id: findUser.id, role: findUser.role },
    process.env.TOKEN_KEY || "secret",
    { expiresIn: "1h" }
  );

  return {
    user: findUser,
    token,
  };
};

export const updateProfileService = async (
  file: Express.Multer.File | undefined,
  id: number
) => {
  if (!file) {
    throw new AppError("No file exist", 400);
  }

  const upload = await cloudinaryUpload(file);

  await updateUser({ imgProfile: upload.secure_url }, id);
};
