import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import {
  loginValidation,
  regisValidation,
} from "../middleware/validation/auth";
import { uploaderMemory } from "../middleware/uploader";
import { verifyToken } from "../middleware/verifyToken";
class AuthRouter {
  private route: Router;
  private authController: AuthController;

  constructor() {
    this.route = Router();
    this.authController = new AuthController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.route.post("/regis", regisValidation, this.authController.register);
    this.route.post("/login", loginValidation, this.authController.login);

    this.route.use(verifyToken);
    this.route.patch(
      "/profile-img",
      uploaderMemory().single("img"),
      this.authController.uploadProfile
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default AuthRouter;
