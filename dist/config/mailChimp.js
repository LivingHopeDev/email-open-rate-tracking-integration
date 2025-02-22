"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailchimpClient = void 0;
// import mailchimp from "@mailchimp/mailchimp_transactional";
const index_1 = __importDefault(require("./index"));
const client = require("@mailchimp/mailchimp_marketing");
client.setConfig({
    apiKey: index_1.default.MAILCHIMP_API_KEY,
    server: index_1.default.MAILCHIMP_DATA_CENTER,
});
exports.mailchimpClient = client;
