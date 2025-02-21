import { Router } from "express";
import {
  createAndSendCampaign,
  getAllCampaignStats,
  getCampaignStats,
} from "../controller/email.controller";
const emailRouter: Router = Router();

emailRouter.post("/send", createAndSendCampaign);
emailRouter.get("/stats/all", getAllCampaignStats);
emailRouter.get("/stats/:campaignId", getCampaignStats);

export { emailRouter };
