import express from "express";
import rootRouter from "./routes/index";
import connectDB from "./config/db";
import config from "./config";
import cors from "cors";
import { errorHandler, routeNotFound } from "./middlewares/error";
const app = express();
app.use(express.json());
app.use(cors());
// connectDB();
// Routes
app.use("/api/v1", rootRouter);

app.use(routeNotFound);
app.use(errorHandler);
const PORT = config.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
