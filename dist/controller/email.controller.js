"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCampaignStats = exports.getCampaignStats = exports.createAndSendCampaign = void 0;
const email_service_1 = require("../services/email.service");
const asyncHandler_1 = __importDefault(require("../middlewares/asyncHandler"));
const emailService = new email_service_1.EmailService();
exports.createAndSendCampaign = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { listId, subject, htmlContent, fromName, replyTo } = req.body;
    // Validate required fields
    if (!listId || !subject || !htmlContent || !fromName || !replyTo) {
        res.status(400).json({ message: "All fields are required." });
        return;
    }
    const campaign = yield emailService.createCampaign(listId, subject, htmlContent, fromName, replyTo);
    const sendResponse = yield emailService.sendCampaign(campaign.id);
    res.status(201).json({
        message: "Campaign created and sent successfully.",
        campaignId: campaign.id,
        sendResponse,
    });
}));
exports.getCampaignStats = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { campaignId } = req.params;
    if (!campaignId) {
        res.status(400).json({ message: "Campaign ID is required." });
        return;
    }
    const stats = yield emailService.getCampaignStats(campaignId);
    res.status(200).json(stats);
}));
exports.getAllCampaignStats = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { message } = yield emailService.fetchAllCampaignStats();
    res.status(200).json({ status: 200, message });
}));
