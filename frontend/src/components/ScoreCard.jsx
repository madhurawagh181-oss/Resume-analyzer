export default function ScoreCard({ score }) {
  if (!score) return null;
  return (
    <section className="panel score-panel">
      <div className="d-flex justify-content-between align-items-start gap-3">
        <div>
          <p className="eyebrow">RESUME SCORE</p>
          <h2>
            {score.score}
            <span className="score-outof"> / {score.maxScore}</span>
          </h2>
          <p className="muted mb-0">{score.label}</p>
        </div>
        <div className="score-ring" aria-label={`${score.score} out of 100`}>
          {score.score}%
        </div>
      </div>
      <p className="small muted mt-3">{score.disclaimer}</p>
      <div className="score-list">
        {score.components.map((item) => (
          <div className="score-row" key={item.key}>
            <div className="d-flex justify-content-between">
              <span>{item.component}</span>
              <strong>
                {item.points}/{item.maxPoints}
              </strong>
            </div>
            <div className="progress">
              <div
                className="progress-bar"
                style={{ width: `${(item.points / item.maxPoints) * 100}%` }}
              />
            </div>
            <small className="muted">{item.explanation}</small>
          </div>
        ))}
      </div>
    </section>
  );
}
