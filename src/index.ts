import express from "express";
import rootRouter from "./routes/index";
import connectDB from "./config/db";
import config from "./config";
import { errorHandler, routeNotFound } from "./middlewares/error";
const app = express();
app.use(express.json());
// connectDB();
// Routes
app.use("/api/v1", rootRouter);

app.use(errorHandler);
app.use(routeNotFound);
const PORT = config.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
