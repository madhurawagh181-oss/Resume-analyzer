export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null;
  return (
    <div
      className="alert alert-danger d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2"
      role="alert"
    >
      <span>
        <i className="bi bi-exclamation-triangle me-2" />
        {message}
      </span>
      {onRetry && (
        <button className="btn btn-sm btn-outline-danger" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
