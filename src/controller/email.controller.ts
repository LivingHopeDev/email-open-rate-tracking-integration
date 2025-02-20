import { Request, Response } from "express";
import { EmailService } from "../services/email.service";
import asyncHandler from "../middlewares/asyncHandler";

const emailService = new EmailService();

export const createAndSendCampaign = asyncHandler(
  async (req: Request, res: Response) => {
    const { listId, subject, htmlContent, fromName, replyTo } = req.body;

    // Validate required fields
    if (!listId || !subject || !htmlContent || !fromName || !replyTo) {
      res.status(400).json({ message: "All fields are required." });
      return;
    }
    const campaign = await emailService.createCampaign(
      listId,
      subject,
      htmlContent,
      fromName,
      replyTo
    );

    const sendResponse = await emailService.sendCampaign(campaign.id);

    res.status(201).json({
      message: "Campaign created and sent successfully.",
      campaignId: campaign.id,
      sendResponse,
    });
  }
);
