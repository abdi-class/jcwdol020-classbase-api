import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import AuthRouter from "./routers/auth.router";

const PORT: string = process.env.PORT || "8080";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.configure();
    this.route();
    this.errorHandler();
  }

  private configure(): void {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private route(): void {
    const authRouter = new AuthRouter();
    this.app.get("/", (req: Request, res: Response) => {
      res.status(200).send("<h1>CLASSBASE API</h1>");
    });

    this.app.use("/auth", authRouter.getRouter());
  }

  private errorHandler(): void {
    this.app.use(
      (error: any, req: Request, res: Response, next: NextFunction) => {
        res.status(error.rc || 500).send(error);
      }
    );
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`CLASSBASE API RUNNING: http://localhost:${PORT}`);
    });
  }
}

export default App;
