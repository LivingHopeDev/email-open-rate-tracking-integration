import express, { Request, Response } from "express";
import rootRouter from "./routes/index";
import connectDB from "./config/db";
import config from "./config";
import cors from "cors";
import path from "path";
import fs from "fs";
import { errorHandler, routeNotFound } from "./middlewares/error";
import morgan from "morgan";
const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("combined"));
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

// morgan(function (tokens, req:Request, res:Response) {
//   return [
//     tokens.method(req, res),
//     tokens.url(req, res),
//     tokens.status(req, res),
//     tokens.res(req, res, "content-length"),
//     "-",
//     tokens["response-time"](req, res),
//     "ms",
//   ].join(" ");
// });
app.use(routeNotFound);
app.use(errorHandler);
const PORT = config.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
