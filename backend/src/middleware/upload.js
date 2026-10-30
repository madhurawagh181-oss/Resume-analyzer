import multer from "multer";
import { env } from "../config/env.js";
import { HttpError } from "../utils/httpError.js";
const maxBytes = env.maxUploadMb * 1024 * 1024;
export const resumeUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: maxBytes,
    files: 1,
    fields: 1,
    parts: 2,
    fieldNameSize: 100,
    fieldSize: 100,
  },
  fileFilter(req, file, callback) {
    const isPdfName = file.originalname?.toLowerCase().endsWith(".pdf");
    const isPdfMime =
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/x-pdf";
    if (!isPdfName || !isPdfMime)
      return callback(
        new HttpError(415, "PDF_ONLY", "Upload a PDF file only."),
      );
    callback(null, true);
  },
}).single("resume");
export function validatePdfMagic(req, res, next) {
  if (!req.file)
    return next(
      new HttpError(400, "RESUME_REQUIRED", "Choose a PDF resume to upload."),
    );
  if (
    !req.file.buffer ||
    req.file.buffer.length < 5 ||
    req.file.buffer.subarray(0, 5).toString() !== "%PDF-"
  )
    return next(
      new HttpError(
        415,
        "INVALID_PDF_CONTENT",
        "The file does not appear to contain valid PDF data.",
      ),
    );
  next();
}
