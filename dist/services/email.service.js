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
exports.EmailService = void 0;
const config_1 = __importDefault(require("../config"));
const mailChimp_1 = require("../config/mailChimp");
const axios_1 = __importDefault(require("axios"));
class EmailService {
    createCampaign(listId, subject, htmlContent, fromName, replyTo) {
        return __awaiter(this, void 0, void 0, function* () {
            const campaign = yield mailChimp_1.mailchimpClient.campaigns.create({
                type: "regular",
                recipients: {
                    list_id: listId,
                },
                settings: {
                    subject_line: subject,
                    preview_text: "This is a test email sent via the Mailchimp API.",
                    title: `Campaign - ${subject}`,
                    from_name: fromName,
                    reply_to: replyTo,
                    to_name: "*|FNAME|*", // Personalization tag for recipient's name
                    auto_footer: true,
                },
            });
            yield mailChimp_1.mailchimpClient.campaigns.setContent(campaign.id, {
                html: htmlContent,
            });
            return campaign;
        });
    }
    sendCampaign(campaignId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield mailChimp_1.mailchimpClient.campaigns.send(campaignId);
            return response;
        });
    }
    getCampaignStats(campaignId) {
        return __awaiter(this, void 0, void 0, function* () {
            const report = yield mailChimp_1.mailchimpClient.reports.getCampaignReport(campaignId);
            const stats = {
                total_recipients: report.emails_sent,
                total_opens: report.opens.opens_total,
                unique_opens: report.opens.unique_opens,
                open_rate: report.opens.open_rate,
                last_open: report.opens.last_open,
                bounces: report.bounces.hard_bounces,
            };
            const webhookPayload = {
                event_name: "email_campaign_stats",
                username: "MailchimpBot",
                status: "success",
                message: `Campaign stats for "${report.campaign_title}":
  - Total Sent: ${report.emails_sent}
  - Total Opens: ${report.opens.opens_total}
  - Unique Opens: ${report.opens.unique_opens}
  - Open Rate: ${report.opens.open_rate}%
  - Total Clicks: ${report.clicks.clicks_total}
  - Unsubscribes: ${report.unsubscribed}
  - Bounces: ${report.bounces.hard_bounces}`,
            };
            //  Send to telex
            const telexResponse = yield axios_1.default.post(config_1.default.TELEX_WEB_HOOK, webhookPayload);
            if (telexResponse.data.status == "error") {
                const message = telexResponse.data.message;
                throw Error(message);
            }
            return {
                stats,
            };
        });
    }
}
exports.EmailService = EmailService;
