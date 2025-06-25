import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const regisValidation = [
  body("username").notEmpty().withMessage("Username is required"),
  body("email").notEmpty().isEmail().withMessage("Email is required"),
  body("password")
    .notEmpty()
    .isStrongPassword({
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    })
    .withMessage(
      "Min. password 6 character, min 1 lowercase, min 1 uppercase and 1 number"
    ),
  body("role").optional(),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const errorValidation = validationResult(req);
      if (!errorValidation.isEmpty()) {
        throw { rc: 400, error: errorValidation.array() };
      }

      next();
    } catch (error: any) {
      res.status(error.rc).send(error);
    }
  },
];
