import { EmailService } from "../services/email.service";

jest.mock("../config/mailChimp", () => ({
  mailchimpClient: {
    campaigns: {
      create: jest.fn(),
      setContent: jest.fn(),
      send: jest.fn(),
      list: jest.fn(),
    },
    reports: {
      getCampaignReport: jest.fn(),
    },
  },
}));

const { mailchimpClient } = jest.requireMock("../config/mailChimp");

describe("Email Service - Unit Tests", () => {
  let emailService;

  beforeEach(() => {
    emailService = new EmailService();
    jest.clearAllMocks();
  });

  it("should create a campaign successfully", async () => {
    const mockCampaign = { id: "12345" };
    mailchimpClient.campaigns.create.mockResolvedValue(mockCampaign);

    const campaign = await emailService.createCampaign(
      "list_1",
      "Test Campaign",
      "<p>Hello</p>",
      "Tester",
      "test@example.com"
    );

    expect(campaign).toEqual(mockCampaign);
    expect(mailchimpClient.campaigns.create).toHaveBeenCalledTimes(1);
    expect(mailchimpClient.campaigns.create).toHaveBeenCalledWith({
      type: "regular",
      recipients: { list_id: "list_1" },
      settings: {
        subject_line: "Test Campaign",
        preview_text: "This is a test email sent via the Mailchimp API.",
        title: "Campaign - Test Campaign",
        from_name: "Tester",
        reply_to: "test@example.com",
        to_name: "*|FNAME|*",
        auto_footer: true,
      },
    });
  });

  it("should set campaign content correctly", async () => {
    mailchimpClient.campaigns.setContent.mockResolvedValue({});

    await emailService.createCampaign(
      "list_1",
      "Test Campaign",
      "<p>Hello</p>",
      "Tester",
      "test@example.com"
    );

    expect(mailchimpClient.campaigns.setContent).toHaveBeenCalledTimes(1);
    expect(mailchimpClient.campaigns.setContent).toHaveBeenCalledWith("12345", {
      html: "<p>Hello</p>",
    });
  });

  it("should send a campaign successfully", async () => {
    const mockResponse = { status: "sent" };
    mailchimpClient.campaigns.send.mockResolvedValue(mockResponse);

    const response = await emailService.sendCampaign("12345");

    expect(response).toEqual(mockResponse);
    expect(mailchimpClient.campaigns.send).toHaveBeenCalledWith("12345");
  });

  it("should handle errors when sending a campaign", async () => {
    mailchimpClient.campaigns.send.mockRejectedValue(new Error("Send failed"));
    await expect(emailService.sendCampaign("12345")).rejects.toThrow(
      "Send failed"
    );
  });

  it("should handle errors when fetching campaign stats", async () => {
    mailchimpClient.reports.getCampaignReport.mockRejectedValue(
      new Error("Stats fetch failed")
    );
    await expect(emailService.getCampaignStats("12345")).rejects.toThrow(
      "Stats fetch failed"
    );
  });

  it("should fetch all campaign stats successfully", async () => {
    const mockCampaigns = [{ id: "12345", campaign_title: "Test Campaign" }];
    const mockReport = {
      emails_sent: 100,
      opens: { opens_total: 80, unique_opens: 70, open_rate: 70 },
      clicks: { clicks_total: 10 },
      unsubscribed: 2,
      bounces: { hard_bounces: 5 },
    };

    mailchimpClient.campaigns.list.mockResolvedValue({
      campaigns: mockCampaigns,
    });
    mailchimpClient.reports.getCampaignReport.mockResolvedValue(mockReport);

    const response = await emailService.fetchAllCampaignStats();

    expect(response.message).toBe(
      "Campaign stats fetched and sent successfully!"
    );
  }, 20000);

  it("should handle errors when fetching all campaign stats", async () => {
    mailchimpClient.campaigns.list.mockRejectedValue(
      new Error("Campaign fetch failed")
    );
    await expect(emailService.fetchAllCampaignStats()).rejects.toThrow(
      "Campaign fetch failed"
    );
  });
});
