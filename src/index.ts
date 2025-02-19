import express from "express";
import rootRouter from "./routes";
import connectDB from "./config/db";
import config from "./config";
const app = express();
app.use(express.json());
connectDB();
// Routes
app.use("/api/v1", rootRouter);

const PORT = config.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
