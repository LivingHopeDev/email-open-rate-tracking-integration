"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./routes/index"));
const config_1 = __importDefault(require("./config"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const error_1 = require("./middlewares/error");
const morgan_1 = __importDefault(require("morgan"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("combined"));
// connectDB();
// Routes
app.get("/integration.json", (req, res) => {
    const integration = fs_1.default.readFileSync(path_1.default.join(__dirname, "public/integration.json"), "utf-8");
    res.status(200).json(JSON.parse(integration));
});
app.use("/api/v1", index_1.default);
app.use(error_1.routeNotFound);
app.use(error_1.errorHandler);
const PORT = config_1.default.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
