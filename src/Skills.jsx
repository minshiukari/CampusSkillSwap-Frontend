import { useState } from "react";
import { useNavigate } from "react-router-dom";

import userService from "./services/userService.js";

function Skills() {
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  const [skillToLearn, setSkillToLearn] = useState("");
  const [skillToTeach, setSkillToTeach] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const learn = skillToLearn.trim();
    const teach = skillToTeach.trim();

    if (!learn || !teach) {
      setError(
        "Please enter both the skill you want to learn and the skill you can teach."
      );
      return;
    }

    if (learn.length > 100 || teach.length > 100) {
      setError("Each skill must be 100 characters or fewer.");
      return;
    }

    if (!userId || !Number.isFinite(Number(userId))) {
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      navigate("/register", { replace: true });
      return;
    }

    setLoading(true);

    try {
      await userService.updateSkills(userId, {
        skillToLearn: learn,
        skillToTeach: teach,
      });

      navigate("/notifications");
    } catch (err) {
      if (!err.response) {
        setError(
          "Cannot connect to the server. Check that the backend is running."
        );
      } else {
        setError(
          err.response.data?.message ||
            err.response.data?.error ||
            "Unable to save your skills. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="skills-page">
      <section className="form-card">
        <div className="form-card-header">
          <a className="brand" href="/">
            <span className="brand-mark">C</span>
            <span>CampusSkillSwap</span>
          </a>

          <h1>Share your skills</h1>

          <p>
            Tell us what you want to learn and what you can teach.
            We'll find students with matching skills.
          </p>
        </div>

        <form className="form-fields" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="skillToLearn">
              What do you want to learn?
            </label>

            <input
              id="skillToLearn"
              type="text"
              value={skillToLearn}
              onChange={(event) => setSkillToLearn(event.target.value)}
              placeholder="e.g. Python, graphic design, guitar"
              maxLength={100}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="skillToTeach">
              What can you teach?
            </label>

            <input
              id="skillToTeach"
              type="text"
              value={skillToTeach}
              onChange={(event) => setSkillToTeach(event.target.value)}
              placeholder="e.g. Photoshop, Java, public speaking"
              maxLength={100}
              required
            />
          </div>

          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="primary-button full-width"
            disabled={loading}
          >
            {loading ? "Finding your matches..." : "Find Matches →"}
          </button>

          <button
            type="button"
            className="secondary-button full-width"
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
        </form>

        <p className="form-footer">
          You can discover matches even when the other student
          doesn't want to learn a skill you teach.
        </p>
      </section>
    </main>
  );
}

export default Skills;