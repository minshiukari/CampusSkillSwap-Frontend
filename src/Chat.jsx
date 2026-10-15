import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useNavigate, useParams } from "react-router-dom";

import chatService from "./services/chatService.js";

function Chat() {
  const { otherUserId } = useParams();
  const navigate = useNavigate();

  const currentUserId = Number(localStorage.getItem("userId"));
  const partnerId = Number(otherUserId);

  const [partner, setPartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const bottomRef = useRef(null);
  const isMountedRef = useRef(true);

  const loadConversation = useCallback(
    async (showLoading = false) => {
      if (
        !Number.isFinite(currentUserId) ||
        currentUserId <= 0 ||
        !Number.isFinite(partnerId) ||
        partnerId <= 0 ||
        currentUserId === partnerId
      ) {
        setError("Invalid chat participants.");
        setLoading(false);
        return;
      }

      if (showLoading) {
        setLoading(true);
      }

      try {
        const [partnerData, messageData] = await Promise.all([
          chatService.getChatPartner(currentUserId, partnerId),
          chatService.getConversation(currentUserId, partnerId),
        ]);

        if (!isMountedRef.current) {
          return;
        }

        setPartner(partnerData);
        setMessages(Array.isArray(messageData) ? messageData : []);
        setError("");
      } catch (err) {
        if (!isMountedRef.current) {
          return;
        }

        if (err.response?.status === 403) {
          setError(
            "Chat is available only after your skill-exchange request has been accepted."
          );
        } else if (err.response?.status === 404) {
          setError("The student or conversation could not be found.");
        } else if (!err.response) {
          setError("Cannot connect to the chat server.");
        } else {
          setError(
            err.response.data?.message ||
              err.response.data?.error ||
              "Unable to load this conversation."
          );
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    },
    [currentUserId, partnerId]
  );

  useEffect(() => {
    isMountedRef.current = true;

    loadConversation(true);

    const intervalId = window.setInterval(() => {
      loadConversation(false);
    }, 3000);

    return () => {
      isMountedRef.current = false;
      window.clearInterval(intervalId);
    };
  }, [loadConversation]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  async function handleSendMessage(event) {
    event.preventDefault();

    const content = messageText.trim();

    if (!content || sending) {
      return;
    }

    if (content.length > 5000) {
      setError("Messages cannot exceed 5000 characters.");
      return;
    }

    setSending(true);
    setError("");

    try {
      const sentMessage = await chatService.sendMessage(
        currentUserId,
        partnerId,
        content
      );

      setMessageText("");

      setMessages((previous) => {
        if (
          previous.some(
            (message) => message.id === sentMessage.id
          )
        ) {
          return previous;
        }

        return [...previous, sentMessage];
      });

      await loadConversation(false);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to send your message."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="chat-page page-container">
      <header className="page-header">
        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate("/notifications")}
        >
          ← Back
        </button>

        <a className="brand" href="/">
          <span className="brand-mark">C</span>
          <span>CampusSkillSwap</span>
        </a>
      </header>

      <section className="chat-panel">
        <div className="chat-header">
          <div className="student-avatar">
            {partner?.name?.charAt(0)?.toUpperCase() || "S"}
          </div>

          <div>
            <h1>{partner?.name || "Conversation"}</h1>

            <p className="muted-text">
              {partner
                ? [partner.department, partner.classYear]
                    .filter(Boolean)
                    .join(" · ")
                : "Loading student details..."}
            </p>
          </div>
        </div>

        {error && (
          <div className="error-message chat-error" role="alert">
            {error}
          </div>
        )}

        <div className="chat-messages" aria-live="polite">
          {loading ? (
            <p className="muted-text">Loading messages...</p>
          ) : messages.length === 0 ? (
            <div className="empty-state">
              <h3>Start the conversation</h3>
              <p>Say hello and begin exchanging skills!</p>
            </div>
          ) : (
            messages.map((message) => {
              const ownMessage =
                Number(message.senderId) === currentUserId;

              return (
                <div
                  key={message.id}
                  className={`message-row ${
                    ownMessage ? "message-row-own" : ""
                  }`}
                >
                  <div
                    className={`message-bubble ${
                      ownMessage ? "message-own" : "message-other"
                    }`}
                  >
                    <p>{message.content}</p>

                    <time>
                      {message.timestamp
                        ? new Date(message.timestamp).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : ""}
                    </time>
                  </div>
                </div>
              );
            })
          )}

          <div ref={bottomRef} />
        </div>

        <form className="chat-input-form" onSubmit={handleSendMessage}>
          <textarea
            value={messageText}
            onChange={(event) => setMessageText(event.target.value)}
            placeholder="Type your message..."
            maxLength={5000}
            rows={2}
            aria-label="Message"
            disabled={sending || Boolean(error)}
          />

          <button
            type="submit"
            className="primary-button"
            disabled={sending || !messageText.trim() || Boolean(error)}
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Chat;