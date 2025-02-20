import { Router } from "express";
import { createAndSendCampaign } from "../controller/email.controller";
const emailRouter: Router = Router();

emailRouter.post("/send", createAndSendCampaign);

export { emailRouter };
