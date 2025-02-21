"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    PORT: (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 5000,
    NODE_ENV: process.env.NODE_ENV,
    FROM_EMAIL: process.env.FROM_EMAIL,
    MAILCHIMP_API_KEY: process.env.MAILCHIMP_API_KEY,
    TELEX_WEBHOOK: process.env.TELEX_WEBHOOK,
};
exports.default = config;
