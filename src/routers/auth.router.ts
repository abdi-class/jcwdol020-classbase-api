import { Router } from "express";
import AuthController from "../controllers/auth.controller";
class AuthRouter {
  private route: Router;
  private authController: AuthController;

  constructor() {
    this.route = Router();
    this.authController = new AuthController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.route.post("/regis", this.authController.register);
    this.route.post("/login", this.authController.login);
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default AuthRouter;
