import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { hashPassword } from "../utils/hash";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { transport } from "../config/nodemailer";
import { cloudinaryUpload } from "../config/cloudinary";
import AppError from "../errors/AppError";
import { loginService, registerService } from "../services/auth.service";

class AuthController {
  public async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await registerService(req.body);

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
      const loginUser = await loginService(req.body);

      res.status(200).send({
        username: loginUser.user.username,
        email: loginUser.user.email,
        imgProfile: loginUser.user.imgProfile,
        role: loginUser.user.role,
        token: loginUser.token,
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
          id: res.locals.decript.id,
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
