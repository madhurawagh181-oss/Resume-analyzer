import roles from "../data/roles.json" with { type: "json" };
import { normalizeSkills } from "../utils/normalizeSkills.js";
import { HttpError } from "../utils/httpError.js";
export function analyzeSkillGap(inputSkills, targetRole) {
  const role = roles.find(
    (item) =>
      item.title.toLowerCase() ===
      String(targetRole || "")
        .trim()
        .toLowerCase(),
  );
  if (!role)
    throw new HttpError(
      400,
      "INVALID_TARGET_ROLE",
      `Choose one of: ${roles.map((r) => r.title).join(", ")}.`,
    );
  const skills = normalizeSkills(inputSkills);
  const have = new Set(skills.map((s) => s.toLowerCase()));
  const matchedSkills = role.skills.filter((s) => have.has(s.toLowerCase()));
  const missingSkills = role.skills
    .filter((s) => !have.has(s.toLowerCase()))
    .map((skill, index) => ({
      skill,
      priority: index < 2 ? "high" : index < 4 ? "medium" : "low",
      suggestion: `Practice ${skill} through a small ${role.title} project and document what you learned.`,
    }));
  return {
    targetRole: role.title,
    matchedSkills,
    missingSkills,
    coveragePercent: Math.round(
      (matchedSkills.length / role.skills.length) * 100,
    ),
    learningSuggestions: role.learning,
    method: "configurable-role-skill-map",
  };
}
