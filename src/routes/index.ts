import { Router } from "express";
import { emailRouter } from "./email.routes";
const rootRouter = Router();

rootRouter.use("/email", emailRouter);

export default rootRouter;
