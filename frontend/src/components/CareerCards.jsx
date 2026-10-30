export default function CareerCards({
  predictions = [],
  geminiRecommendations = [],
}) {
  const geminiByRole = new Map(
    geminiRecommendations.map((r) => [r.role.toLowerCase(), r]),
  );
  return (
    <div className="career-grid">
      {predictions.map((item, i) => {
        const ai = geminiByRole.get(item.role.toLowerCase());
        return (
          <article className="panel career-card" key={item.role}>
            <div className="d-flex align-items-start justify-content-between gap-2">
              <span className="career-icon">
                <i className="bi bi-briefcase" />
              </span>
              <span className="match-pill">{item.score}% match</span>
            </div>
            <p className="eyebrow mt-3">
              {i === 0 ? "TOP BASELINE MATCH" : "CAREER OPTION"}
            </p>
            <h3>{item.role}</h3>
            <div className="progress my-3">
              <div
                className="progress-bar"
                style={{ width: `${item.score}%` }}
              />
            </div>
            <p>{item.explanation}</p>
            {item.matchedSkills.length > 0 && (
              <p className="small">
                <strong>Matched:</strong> {item.matchedSkills.join(", ")}
              </p>
            )}
            {ai && (
              <div className="ai-note">
                <strong>
                  <i className="bi bi-stars me-1" />
                  Gemini insight
                </strong>
                <p className="mb-1">{ai.explanation}</p>
                {ai.evidence?.length > 0 && (
                  <small>Evidence: {ai.evidence.join(", ")}</small>
                )}
              </div>
            )}
            <small className="muted">
              Baseline score is skill overlap, not probability. {item.method}.
            </small>
          </article>
        );
      })}
    </div>
  );
}
