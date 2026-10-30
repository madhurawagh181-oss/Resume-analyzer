import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import careerRoutes from "./routes/careerRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
const app = express();
app.disable("x-powered-by");
app.use(helmet());
app.use(
  cors({
    origin: env.frontendOrigin.split(",").map((v) => v.trim()),
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  }),
);
app.use(express.json({ limit: "100kb" }));
app.get("/api/health", (req, res) =>
  res.json({
    success: true,
    data: {
      status: "ok",
      geminiConfigured: Boolean(env.geminiApiKey),
      model: env.geminiModel,
      maxUploadMb: env.maxUploadMb,
    },
  }),
);
app.use("/api/resume", resumeRoutes);
app.use("/api/career", careerRoutes);
app.use("/api/skills", careerRoutes);
app.use(notFound);
app.use(errorHandler);
export default app;
