import aliases from "../data/skillAliases.json" with { type: "json" };

const commonAliases = {
  "react js": "React",
  "react.js": "React",
  springboot: "Spring Boot",
  "rest apis": "REST API",
  "rest apis development": "REST API",
  javascript: "JavaScript",
  "c (basic)": "C",
  "c++ (basic)": "C++",
  "python (basic)": "Python",
};

export function normalizeSkill(value) {
  let clean = String(value || "")
    .trim()
    .replace(/\s+/g, " ");

  if (!clean) return "";

  // Remove proficiency labels such as "(Basic)".
  clean = clean
    .replace(/\s*\((basic|beginner|intermediate|advanced)\)$/i, "")
    .trim();

  const key = clean.toLowerCase();

  return aliases[key] || commonAliases[key] || clean;
}

export function normalizeSkills(skills) {
  if (!Array.isArray(skills)) return [];

  return [...new Set(skills.map(normalizeSkill).filter(Boolean))];
}
