import { useNavigate } from "react-router-dom";

function SkillCard({
  student,
  currentUserId,
  requestSent,
  requestAccepted,
  sending,
  onSendRequest,
  onOpenChat,
}) {
  const navigate = useNavigate();

  if (!student || Number(student.id) === Number(currentUserId)) {
    return null;
  }

  const name = student.name || "Campus student";
  const initial = name.charAt(0).toUpperCase();

  return (
    <article className="student-card">
      <div className="student-card-main">
        <div className="student-avatar">{initial}</div>

        <div className="student-details">
          <h3>{name}</h3>

          <p className="student-meta">
            {[student.department, student.classYear]
              .filter(Boolean)
              .join(" · ") || "Campus student"}
          </p>

          <div className="student-skills">
            {student.skillToTeach && (
              <p>
                <strong>Can teach:</strong> {student.skillToTeach}
              </p>
            )}

            {student.skillToLearn && (
              <p>
                <strong>Wants to learn:</strong> {student.skillToLearn}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="student-actions">
        {requestAccepted ? (
          <button
            type="button"
            className="primary-button"
            onClick={() => {
              if (onOpenChat) {
                onOpenChat(student.id);
              } else {
                navigate(`/chat/${student.id}`);
              }
            }}
          >
            Open Chat
          </button>
        ) : requestSent ? (
          <button
            type="button"
            className="secondary-button"
            disabled
          >
            Request Sent
          </button>
        ) : (
          <button
            type="button"
            className="primary-button"
            disabled={sending}
            onClick={() => onSendRequest(student.id)}
          >
            {sending ? "Sending..." : "Send Request"}
          </button>
        )}
      </div>
    </article>
  );
}

export default SkillCard;