"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const email_routes_1 = require("./email.routes");
const rootRouter = (0, express_1.Router)();
rootRouter.use("/email", email_routes_1.emailRouter);
exports.default = rootRouter;
