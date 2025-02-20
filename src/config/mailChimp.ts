// import mailchimp from "@mailchimp/mailchimp_transactional";
import config from "./index";
const client = require("@mailchimp/mailchimp_marketing");

client.setConfig({
  apiKey: config.MAILCHIMP_API_KEY,
  server: "us10",
});

export const mailchimpClient = client;
