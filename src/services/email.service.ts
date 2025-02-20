import config from "../config";
import { mailchimpClient } from "../config/mailChimp";
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

  /**
   * Get campaign stats (opens, unique opens, open rate, etc.).
   * @param campaignId - The ID of the campaign to retrieve stats for.
   * @returns Campaign stats.
   */
  public async getCampaignStats(campaignId: string) {
    // try {
    const report = await mailchimpClient.reports.getCampaignReport(campaignId);
    return {
      total_opens: report.opens_total,
      unique_opens: report.opens.unique_opens,
      open_rate: report.opens.open_rate,
      last_open: report.opens.last_open,
    };
    // } catch (error) {
    //   console.error("Error fetching campaign stats:", error);
    //   throw new Error("Failed to fetch campaign stats.");
    // }
  }
}
