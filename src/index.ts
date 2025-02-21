import express, { Request, Response } from "express";
import rootRouter from "./routes/index";
import connectDB from "./config/db";
import config from "./config";
import cors from "cors";
import path from "path";
import fs from "fs";
import { errorHandler, routeNotFound } from "./middlewares/error";
const app = express();
app.use(express.json());
app.use(cors());
// connectDB();
// Routes
app.get("/integration.json", (req: Request, res: Response) => {
  const integration = fs.readFileSync(
    path.join(__dirname, "public/integration.json"),
    "utf-8"
  );

  res.status(200).json(JSON.parse(integration));
});
app.use("/api/v1", rootRouter);

app.use(routeNotFound);
app.use(errorHandler);
const PORT = config.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
