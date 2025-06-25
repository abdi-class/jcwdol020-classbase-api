import { Request } from "express";
import multer from "multer";

export const uploaderMemory = () => {
  return multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 1 * 1024 * 1024 },
    fileFilter: (req: Request, file: Express.Multer.File, callback) => {
      const allowedExt = /\.(jpeg|jpg|png|gif)$/;
      const existingName = file.originalname.split(".");
      const ext = existingName[existingName.length - 1].toLowerCase();
      if (!allowedExt.test(ext)) {
        return callback(
          new Error("Wrong file extention only (jpeg|jpg|png|gif)")
        );
      }
      callback(null, true);
    },
  });
};
