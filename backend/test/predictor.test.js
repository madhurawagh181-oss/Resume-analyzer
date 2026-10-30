import test from "node:test";
import assert from "node:assert/strict";
import { predictCareers } from "../src/services/careerPredictor.js";
import { analyzeSkillGap } from "../src/services/skillGapService.js";
import { scoreResume } from "../src/services/resumeScorer.js";
test("career predictor ranks matching Java skills without claiming trained ML", () => {
  const results = predictCareers([
    "Java",
    "Spring Boot",
    "SQL",
    "REST APIs",
    "OOP",
    "Collections",
    "Exception Handling",
    "Git",
  ]);
  assert.equal(results[0].role, "Java Developer");
  assert.equal(results[0].isTrainedModel, false);
  assert.ok(results[0].score > 0);
});
test("skill gap validates role and identifies missing skills", () => {
  const result = analyzeSkillGap(["Java", "SQL"], "Java Developer");
  assert.ok(result.matchedSkills.includes("Java"));
  assert.ok(result.missingSkills.length > 0);
});
test("resume score stays within 0-100 and has explanations", () => {
  const score = scoreResume({
    name: "",
    summary: "",
    education: [],
    experience: [],
    projects: [],
    certifications: [],
    technicalSkills: [],
    softSkills: [],
  });
  assert.equal(score.score, 0);
  assert.equal(score.maxScore, 100);
  assert.ok(score.components.every((c) => typeof c.explanation === "string"));
});
