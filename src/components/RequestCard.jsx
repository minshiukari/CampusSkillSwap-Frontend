import { useNavigate } from "react-router-dom";

function RequestCard({
  request,
  type,
  busy,
  onAccept,
  onReject,
  onOpenChat,
}) {
  const navigate = useNavigate();

  if (!request) {
    return null;
  }

  const isReceived = type === "received";

  const otherStudent = isReceived
    ? {
        id: request.senderId,
        name: request.senderName,
        department: request.senderDepartment,
        classYear: request.senderClassYear,
      }
    : {
        id: request.receiverId,
        name: request.receiverName,
        department: request.receiverDepartment,
        classYear: request.receiverClassYear,
      };

  const name = otherStudent.name || "Campus student";
  const status = String(request.status || "PENDING").toUpperCase();

  function openChat() {
    if (onOpenChat) {
      onOpenChat(otherStudent.id);
    } else {
      navigate(`/chat/${otherStudent.id}`);
    }
  }

  return (
    <article className="request-card">
      <div className="request-card-main">
        <div className="student-avatar">
          {name.charAt(0).toUpperCase()}
        </div>

        <div className="student-details">
          <h3>{name}</h3>

          <p className="student-meta">
            {[otherStudent.department, otherStudent.classYear]
              .filter(Boolean)
              .join(" · ") || "Campus student"}
          </p>

          <span
            className={`request-status status-${status.toLowerCase()}`}
          >
            {status.charAt(0) + status.slice(1).toLowerCase()}
          </span>

          {request.createdAt && (
            <p className="request-date">
              {new Date(request.createdAt).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      <div className="student-actions">
        {isReceived && status === "PENDING" && (
          <>
            <button
              type="button"
              className="primary-button"
              disabled={busy}
              onClick={onAccept}
            >
              {busy ? "Please wait..." : "Accept"}
            </button>

            <button
              type="button"
              className="secondary-button danger-button"
              disabled={busy}
              onClick={onReject}
            >
              Reject
            </button>
          </>
        )}

        {status === "ACCEPTED" && (
          <button
            type="button"
            className="primary-button"
            onClick={openChat}
          >
            Open Chat
          </button>
        )}

        {status === "PENDING" && !isReceived && (
          <span className="muted-text">Awaiting response</span>
        )}

        {status === "REJECTED" && (
          <span className="muted-text">Request declined</span>
        )}
      </div>
    </article>
  );
}

export default RequestCard;