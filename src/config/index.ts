import dotenv from "dotenv";
dotenv.config();

const config = {
  PORT: process.env.PORT ?? 5000,
  NODE_ENV: process.env.NODE_ENV,
  FROM_EMAIL: process.env.FROM_EMAIL,
  MAILCHIMP_API_KEY: process.env.MAILCHIMP_API_KEY,
  TELEX_WEBHOOK: process.env.TELEX_WEBHOOK,
};

export default config;
