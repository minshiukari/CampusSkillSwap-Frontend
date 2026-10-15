import { useNavigate } from "react-router-dom";

function NavigationBar({ showNotifications = true }) {
  const navigate = useNavigate();

  return (
    <header className="page-header">
      <button
        type="button"
        className="brand"
        onClick={() => navigate("/")}
        aria-label="CampusSkillSwap home"
        style={{
          border: "none",
          background: "transparent",
          padding: 0,
        }}
      >
        <span className="brand-mark">C</span>
        <span>CampusSkillSwap</span>
      </button>

      <nav
        aria-label="Main navigation"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        {showNotifications && localStorage.getItem("userId") && (
          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate("/notifications")}
          >
            Notifications
          </button>
        )}

        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate("/skills")}
        >
          My Skills
        </button>
      </nav>
    </header>
  );
}

export default NavigationBar;