import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import matchService from "./services/matchService.js";
import requestService from "./services/requestService.js";

import SkillCard from "./components/SkillCard.jsx";
import RequestCard from "./components/RequestCard.jsx";

function Notifications() {
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  const [canTeach, setCanTeach] = useState([]);
  const [wantToLearn, setWantToLearn] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [busyRequestId, setBusyRequestId] = useState(null);
  const [sendingToId, setSendingToId] = useState(null);

  const loadNotifications = useCallback(async () => {
    if (!userId || !Number.isFinite(Number(userId))) {
      navigate("/register", { replace: true });
      return;
    }

    setError("");

    try {
      const [
        canTeachResults,
        wantToLearnResults,
        receivedResults,
        sentResults,
      ] = await Promise.all([
        matchService.getStudentsWhoCanTeach(userId),
        matchService.getStudentsWhoWantToLearn(userId),
        requestService.getReceivedRequests(userId),
        requestService.getSentRequests(userId),
      ]);

      setCanTeach(Array.isArray(canTeachResults) ? canTeachResults : []);
      setWantToLearn(Array.isArray(wantToLearnResults) ? wantToLearnResults : []);
      setReceivedRequests(Array.isArray(receivedResults) ? receivedResults : []);
      setSentRequests(Array.isArray(sentResults) ? sentResults : []);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError(
          "Your session could not be verified. Please check your account and try again."
        );
      } else if (!err.response) {
        setError(
          "Cannot connect to the backend. Check that the server is running on port 8080."
        );
      } else {
        setError(
          err.response.data?.message ||
            err.response.data?.error ||
            "Unable to load notifications."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [userId, navigate]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const acceptedPartnerIds = new Set();

  [...receivedRequests, ...sentRequests].forEach((request) => {
    if (String(request.status).toUpperCase() !== "ACCEPTED") {
      return;
    }

    const senderId = Number(request.senderId);
    const receiverId = Number(request.receiverId);
    const currentId = Number(userId);

    if (senderId === currentId) {
      acceptedPartnerIds.add(receiverId);
    } else if (receiverId === currentId) {
      acceptedPartnerIds.add(senderId);
    }
  });

  const pendingRequestIds = new Set(
    sentRequests
      .filter(
        (request) => String(request.status).toUpperCase() === "PENDING"
      )
      .map((request) => Number(request.receiverId))
  );

  async function handleSendRequest(receiverId) {
    setActionError("");
    setSendingToId(receiverId);

    try {
      await requestService.sendRequest(userId, receiverId);
      await loadNotifications();
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to send the request. Please try again."
      );
    } finally {
      setSendingToId(null);
    }
  }

  async function handleRequestStatus(requestId, status) {
    setActionError("");
    setBusyRequestId(requestId);

    try {
      await requestService.updateRequestStatus(requestId, status, userId);
      await loadNotifications();
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          `Unable to ${status.toLowerCase()} this request.`
      );
    } finally {
      setBusyRequestId(null);
    }
  }

  function openChat(otherUserId) {
    navigate(`/chat/${otherUserId}`);
  }

  function renderSkillCards(students) {
    if (students.length === 0) {
      return (
        <div className="empty-state">
          <h3>No matches yet</h3>
          <p>
            No students match this skill at the moment.
            Check again after more students join.
          </p>
        </div>
      );
    }

    return (
      <div className="student-list">
        {students.map((student) => (
          <SkillCard
            key={student.id}
            student={student}
            currentUserId={Number(userId)}
            requestSent={pendingRequestIds.has(Number(student.id))}
            requestAccepted={acceptedPartnerIds.has(Number(student.id))}
            sending={sendingToId === student.id}
            onSendRequest={handleSendRequest}
            onOpenChat={openChat}
          />
        ))}
      </div>
    );
  }

  if (loading) {
    return (
      <main className="notifications-page page-container">
        <p className="muted-text">Loading your notifications...</p>
      </main>
    );
  }

  return (
    <main className="notifications-page page-container">
      <header className="page-header">
        <a className="brand" href="/">
          <span className="brand-mark">C</span>
          <span>CampusSkillSwap</span>
        </a>

        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate("/skills")}
        >
          Edit Skills
        </button>
      </header>

      <section className="notifications-heading">
        <h1>Your Skill Matches</h1>
        <p className="muted-text">
          Discover students to learn from, teach, and connect with.
        </p>
      </section>

      {error && (
        <div className="error-message" role="alert">
          {error}
          <button
            type="button"
            className="text-button"
            onClick={loadNotifications}
          >
            Retry
          </button>
        </div>
      )}

      {actionError && (
        <div className="error-message" role="alert">
          {actionError}
        </div>
      )}

      <section className="notification-section">
        <h2>Skills I Want to Learn</h2>
        <p className="muted-text">
          These students can teach you the skill you selected.
        </p>

        {renderSkillCards(canTeach)}
      </section>

      <section className="notification-section">
        <h2>Skills I Can Teach</h2>
        <p className="muted-text">
          These students want to learn the skill you can teach.
        </p>

        {renderSkillCards(wantToLearn)}
      </section>

      <section className="notification-section">
        <h2>Incoming Requests</h2>

        {receivedRequests.length === 0 ? (
          <div className="empty-state">
            <p>You don't have any incoming requests yet.</p>
          </div>
        ) : (
          <div className="student-list">
            {receivedRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                type="received"
                busy={busyRequestId === request.id}
                onAccept={() => handleRequestStatus(request.id, "ACCEPTED")}
                onReject={() => handleRequestStatus(request.id, "REJECTED")}
                onOpenChat={openChat}
              />
            ))}
          </div>
        )}
      </section>

      <section className="notification-section">
        <h2>Sent Requests</h2>

        {sentRequests.length === 0 ? (
          <div className="empty-state">
            <p>You haven't sent any requests yet.</p>
          </div>
        ) : (
          <div className="student-list">
            {sentRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                type="sent"
                busy={busyRequestId === request.id}
                onOpenChat={openChat}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Notifications;