"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailRouter = void 0;
const express_1 = require("express");
const email_controller_1 = require("../controller/email.controller");
const emailRouter = (0, express_1.Router)();
exports.emailRouter = emailRouter;
emailRouter.post("/send", email_controller_1.createAndSendCampaign);
emailRouter.get("/stats/:campaignId", email_controller_1.getCampaignStats);
