import { Router } from "express";
import { analyzeResume } from "../controllers/resumeController.js";
import { resumeUpload, validatePdfMagic } from "../middleware/upload.js";
import { errorHandler } from "../middleware/errorHandler.js";
const router = Router();
router.post(
  "/analyze",
  (req, res, next) =>
    resumeUpload(req, res, (error) => (error ? next(error) : next())),
  validatePdfMagic,
  analyzeResume,
);
// Route-scoped upload errors still pass through the global error handler.
export default router;
