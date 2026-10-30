import roles from "../data/roles.json" with { type: "json" };
import { normalizeSkills, normalizeSkill } from "../utils/normalizeSkills.js";

export function predictCareers(inputSkills = []) {
  const skills = normalizeSkills(inputSkills);

  const userSkillSet = new Set(
    skills.map((skill) => normalizeSkill(skill).toLowerCase()),
  );

  return roles
    .map((role) => {
      const matchedSkills = role.skills.filter((skill) =>
        userSkillSet.has(normalizeSkill(skill).toLowerCase()),
      );

      const missingSkills = role.skills.filter(
        (skill) => !userSkillSet.has(normalizeSkill(skill).toLowerCase()),
      );

      const score = role.skills.length
        ? Math.round((matchedSkills.length / role.skills.length) * 100)
        : 0;

      return {
        role: role.title,
        score,
        matchedSkills,
        missingSkills,
        explanation: matchedSkills.length
          ? `Matched ${matchedSkills.length} of ${role.skills.length} listed role skills: ${matchedSkills.join(", ")}.`
          : `No direct matches were found among the configured skills for ${role.title}.`,
        method: "baseline-rule-based",
        isTrainedModel: false,
      };
    })
    .sort((a, b) => b.score - a.score || a.role.localeCompare(b.role));
}
