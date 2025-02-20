import { Router } from "express";
import {
  createAndSendCampaign,
  getCampaignStats,
} from "../controller/email.controller";
const emailRouter: Router = Router();

emailRouter.post("/send", createAndSendCampaign);
emailRouter.get("/stats/:campaignId", getCampaignStats);

export { emailRouter };
