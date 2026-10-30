import { Router } from "express";
import {
  predictCareer,
  analyzeSkills,
} from "../controllers/resumeController.js";
const router = Router();
router.post("/predict", predictCareer);
router.post("/analyze", analyzeSkills);
export default router;
