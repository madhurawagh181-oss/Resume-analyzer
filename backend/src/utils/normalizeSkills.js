import aliases from '../data/skillAliases.json' with { type: 'json' };
export function normalizeSkill(value) {
  const clean = String(value || '').trim();
  if (!clean) return '';
  return aliases[clean.toLowerCase()] || clean.replace(/\s+/g, ' ');
}
export function normalizeSkills(skills) {
  if (!Array.isArray(skills)) return [];
  return [...new Set(skills.map(normalizeSkill).filter(Boolean))];
}
