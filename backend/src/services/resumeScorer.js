const checks = [
  { key: 'contactInformation', label: 'Contact information', points: 10, test: a => Boolean(a.name) },
  { key: 'summary', label: 'Professional summary', points: 10, test: a => Boolean(a.summary) },
  { key: 'technicalSkills', label: 'Technical skills', points: 20, test: a => a.technicalSkills.length >= 3 },
  { key: 'education', label: 'Education', points: 15, test: a => a.education.length > 0 },
  { key: 'experience', label: 'Experience', points: 15, test: a => a.experience.length > 0 },
  { key: 'projects', label: 'Projects', points: 15, test: a => a.projects.length > 0 },
  { key: 'certifications', label: 'Certifications', points: 5, test: a => a.certifications.length > 0 },
  { key: 'softSkills', label: 'Soft skills', points: 5, test: a => a.softSkills.length > 0 },
  { key: 'clarity', label: 'Summary and section clarity', points: 5, test: a => Boolean(a.summary) && (a.education.length + a.projects.length + a.experience.length > 0) }
];
export function scoreResume(analysis) {
  const components = checks.map(c => ({ component: c.label, key: c.key, maxPoints: c.points, points: c.test(analysis) ? c.points : 0, explanation: c.test(analysis) ? 'Evidence was identified in the supplied resume.' : 'Evidence was not clearly identified; verify this section manually.' }));
  const total = components.reduce((sum, c) => sum + c.points, 0);
  return { score: total, maxScore: 100, label: 'Estimated resume completeness score', disclaimer: 'This rubric-based estimate measures visible resume sections only. It is not a hiring decision or a measure of a person’s worth or job performance.', components, rubric: 'Fixed section-presence checklist; no hidden AI score or employer ranking.' };
}
