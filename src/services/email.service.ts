import config from "../config";
import { mailchimpClient } from "../config/mailChimp";
import axios from "axios";
import { BadRequest, ResourceNotFound } from "../middlewares/error";
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
    const telexResponse = await axios.post(
      config.TELEX_WEBHOOK,
      webhookPayload
    );
    if (telexResponse.data.status == "error") {
      const message = telexResponse.data.message;
      throw new BadRequest(message);
    }

    return {
      stats,
    };
  }

  public async fetchAllCampaignStats() {
    const campaignsResponse = await mailchimpClient.campaigns.list();
    const campaigns = campaignsResponse?.campaigns || [];
    if (campaigns.length === 0) {
      throw new ResourceNotFound("No campaigns found.");
    }

    let formattedStats = "";

    for (const campaign of campaigns) {
      const report = await mailchimpClient.reports.getCampaignReport(
        campaign.id
      );

      formattedStats += `
*${report.campaign_title}*
- Total Sent: ${report.emails_sent}
- Total Opens: ${report.opens.opens_total}
- Unique Opens: ${report.opens.unique_opens}
- Open Rate: ${report.opens.open_rate}%
- Total Clicks: ${report.clicks.clicks_total}
- Unsubscribes: ${report.unsubscribed}
- Bounces: ${report.bounces.hard_bounces}

`;
    }

    // Send stats to Telex webhook
    const webhookPayload = {
      event_name: "email_campaign_stats",
      username: "MailchimpBot",
      status: "success",
      message: ` *Campaign Performance Overview:*\n${formattedStats}`,
    };

    const telexResponse = await axios.post(
      config.TELEX_WEBHOOK,
      webhookPayload
    );
    if (telexResponse.data.status == "error") {
      const message = telexResponse.data.message;
      throw new BadRequest(message);
    }
    return {
      message: "Campaign stats fetched and sent successfully!",
    };
  }
}
