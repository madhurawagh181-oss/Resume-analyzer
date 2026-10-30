const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options);
  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error("The server returned an unreadable response.");
  }
  if (!response.ok || !payload.success)
    throw new Error(payload?.error?.message || "Request failed.");
  return payload.data;
}
export function uploadResume(file, targetRole) {
  const form = new FormData();
  form.append("resume", file);
  if (targetRole) form.append("targetRole", targetRole);
  return request("/resume/analyze", { method: "POST", body: form });
}
export function predictCareers(skills) {
  return request("/career/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ skills }),
  });
}
export function analyzeSkills(skills, targetRole) {
  return request("/skills/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ skills, targetRole }),
  });
}
