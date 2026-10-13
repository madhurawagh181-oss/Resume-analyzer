import roles from '../data/roles.json' with { type: 'json' };
import { normalizeSkills } from '../utils/normalizeSkills.js';

// Replace this function with a separately deployed, genuinely trained model when one exists.
// Current scores are keyword-overlap estimates, not ML probabilities.
export function predictCareers(inputSkills = []) {
  const skills = normalizeSkills(inputSkills);
  const lower = new Set(skills.map(s => s.toLowerCase()));
  return roles.map(role => {
    const matchedSkills = role.skills.filter(skill => lower.has(skill.toLowerCase()));
    const missingSkills = role.skills.filter(skill => !lower.has(skill.toLowerCase()));
    const score = role.skills.length ? Math.round((matchedSkills.length / role.skills.length) * 100) : 0;
    return { role: role.title, score, matchedSkills, missingSkills, explanation: matchedSkills.length ? `Matched ${matchedSkills.length} of ${role.skills.length} listed role skills: ${matchedSkills.join(', ')}.` : `No direct matches were found among the configured skills for ${role.title}.`, method: 'baseline-rule-based', isTrainedModel: false };
  }).sort((a, b) => b.score - a.score || a.role.localeCompare(b.role));
}
