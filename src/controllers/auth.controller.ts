import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { hashPassword } from "../utils/hash";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { transport } from "../config/nodemailer";
import { cloudinaryUpload } from "../config/cloudinary";
import AppError from "../errors/AppError";

class AuthController {
  public async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const existingUser = await prisma.user.findUnique({
        where: {
          email: req.body.email,
        },
      });

      if (existingUser) {
        throw new AppError("User already exist", 400);
      }

      const newUser = await prisma.user.create({
        data: {
          ...req.body,
          password: await hashPassword(req.body.password),
          role: req.body.role || "admin",
        },
      });

      await transport.sendMail({
        from: process.env.MAILERSENDER,
        to: newUser.email,
        subject: "Verify Registration Account",
        html: `<h1>Thank you for register account ${newUser.username}</h1>`,
      });

      res.status(201).send({
        success: true,
        message: "User register success",
      });
    } catch (error) {
      next(error);
    }
  }

  public async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const findUser = await prisma.user.findUnique({
        where: {
          email: req.body.email,
        },
      });

      if (!findUser) {
        throw new AppError("User not exist", 404);
      }

      const comparePass = await compare(req.body.password, findUser.password);
      if (!comparePass) {
        throw new AppError("Password is wrong", 401);
      }

      const token = sign(
        { id: findUser.id, role: findUser.role },
        process.env.TOKEN_KEY || "secret",
        { expiresIn: "1h" }
      );

      res.status(200).send({
        username: findUser.username,
        email: findUser.email,
        imgProfile: findUser.imgProfile,
        role: findUser.role,
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  public async uploadProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      //
      if (!req.file) {
        throw new AppError("No file exist", 400);
      }

      const upload = await cloudinaryUpload(req.file);

      await prisma.user.update({
        data: {
          imgProfile: upload.secure_url,
        },
        where: {
          id: Number(req.params.id),
        },
      });

      res.status(200).send({
        success: true,
        message: "Update profile image success",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
