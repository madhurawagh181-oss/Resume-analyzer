import { analyzePdfWithGemini } from "../services/geminiService.js";
import { scoreResume } from "../services/resumeScorer.js";
import { predictCareers } from "../services/careerPredictor.js";
import { analyzeSkillGap } from "../services/skillGapService.js";
import { HttpError } from "../utils/httpError.js";
export async function analyzeResume(req, res, next) {
  try {
    const analysis = await analyzePdfWithGemini(req.file.buffer);
    const score = scoreResume(analysis);
    const careerPredictions = predictCareers(analysis.technicalSkills);
    const requestedRole = String(req.body?.targetRole || "").trim();
    let skillGap = null;
    if (requestedRole)
      skillGap = analyzeSkillGap(
        [...analysis.technicalSkills, ...analysis.softSkills],
        requestedRole,
      );
    res.json({
      success: true,
      data: {
        analysis,
        score,
        careerPredictions,
        geminiRecommendations: analysis.careerRecommendations,
        skillGap,
        meta: {
          predictor: "baseline-rule-based",
          trainedModelUsed: false,
          resumeStored: false,
        },
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (req.file) req.file.buffer = null;
  }
}
export function predictCareer(req, res, next) {
  try {
    const skills = req.body?.skills ?? req.body?.analysis?.technicalSkills;
    if (!Array.isArray(skills) || skills.some((s) => typeof s !== "string"))
      throw new HttpError(
        400,
        "INVALID_SKILLS",
        "Provide skills as an array of strings, or analysis.technicalSkills as an array.",
      );
    res.json({
      success: true,
      data: {
        predictions: predictCareers(skills),
        method: "baseline-rule-based",
        trainedModelUsed: false,
      },
    });
  } catch (error) {
    next(error);
  }
}
export function analyzeSkills(req, res, next) {
  try {
    const { skills, targetRole } = req.body || {};
    if (!Array.isArray(skills) || skills.some((s) => typeof s !== "string"))
      throw new HttpError(
        400,
        "INVALID_SKILLS",
        "Provide skills as an array of strings.",
      );
    if (typeof targetRole !== "string" || !targetRole.trim())
      throw new HttpError(
        400,
        "TARGET_ROLE_REQUIRED",
        "targetRole is required.",
      );
    res.json({ success: true, data: analyzeSkillGap(skills, targetRole) });
  } catch (error) {
    next(error);
  }
}
