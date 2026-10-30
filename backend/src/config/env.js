import dotenv from "dotenv";
dotenv.config();

const maxUploadMb = Number.parseInt(process.env.MAX_UPLOAD_MB || "5", 10);
export const env = {
  port: Number.parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  geminiModel: process.env.GEMINI_MODEL || "gemini-3.8-flash",
  maxUploadMb:
    Number.isFinite(maxUploadMb) && maxUploadMb > 0
      ? Math.min(maxUploadMb, 20)
      : 5,
};
