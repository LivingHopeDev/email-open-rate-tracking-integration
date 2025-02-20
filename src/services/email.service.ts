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
}
