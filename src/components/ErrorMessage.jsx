function ErrorMessage({ message, onRetry }) {
  if (!message) {
    return null;
  }

  return (
    <div className="error-message reusable-error" role="alert">
      <span>{message}</span>

      {onRetry && (
        <button
          type="button"
          className="text-button"
          onClick={onRetry}
        >
          Try again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;