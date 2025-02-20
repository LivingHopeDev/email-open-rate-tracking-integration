import config from "../config";
import { mailchimpClient } from "../config/mailChimp";
import axios from "axios";
export class EmailService {
  public async createCampaign(
    listId: string,
    subject: string,
    htmlContent: string,
    fromName: string,
    replyTo: string
  ) {
    const campaign = await mailchimpClient.campaigns.create({
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

    await mailchimpClient.campaigns.setContent(campaign.id, {
      html: htmlContent,
    });

    return campaign;
  }

  public async sendCampaign(campaignId: string) {
    const response = await mailchimpClient.campaigns.send(campaignId);
    return response;
  }

  public async getCampaignStats(campaignId: string) {
    const report = await mailchimpClient.reports.getCampaignReport(campaignId);
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
      message: `Campaign stats fetched successfully for ${report.campaign_title}.`,
    };
    //  Send to telex
    const telexResponse = await axios.post(
      config.TELEX_WEB_HOOK,
      webhookPayload
    );
    if (!telexResponse) {
      throw Error("telex error");
    }
    console.log(telexResponse.data);
    return {
      stats,
    };
  }
}
