import { useState } from "react";
import { useNavigate } from "react-router-dom";

import userService from "./services/userService.js";

const initialForm = {
  name: "",
  email: "",
  password: "",
  department: "",
  classYear: "",
};

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password;
    const department = form.department.trim();
    const classYear = form.classYear;

    if (!name || !email || !password || !department || !classYear) {
      setError("Please complete every field.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const registeredUser = await userService.register({
        name,
        email,
        password,
        department,
        classYear,
        skillToLearn: "",
        skillToTeach: "",
      });

      if (!registeredUser || registeredUser.id == null) {
        throw new Error(
          "Registration completed without returning a student ID."
        );
      }

      localStorage.setItem("userId", String(registeredUser.id));
      localStorage.setItem("userName", registeredUser.name || name);

      navigate("/skills", { replace: true });
    } catch (err) {
      const serverMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message;

      if (err.code === "ECONNABORTED") {
        setError("The server took too long to respond. Please try again.");
      } else if (!err.response) {
        setError(
          "Cannot connect to the server. Make sure the backend is running on port 8080."
        );
      } else {
        setError(serverMessage || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="register-page">
      <section className="form-card">
        <div className="form-card-header">
          <a className="brand" href="/" aria-label="CampusSkillSwap home">
            <span className="brand-mark">C</span>
            <span>CampusSkillSwap</span>
          </a>

          <h1>Create your account</h1>

          <p>
            Join your campus community and start exchanging skills.
          </p>
        </div>

        <form className="form-fields" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full name</label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
              maxLength={100}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">University email</label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@university.edu"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              maxLength={254}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="At least 8 characters"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              minLength={8}
              maxLength={128}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="department">Department</label>

            <input
              id="department"
              name="department"
              type="text"
              placeholder="e.g. Computer Science"
              value={form.department}
              onChange={handleChange}
              maxLength={100}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="classYear">Current year</label>

            <select
              id="classYear"
              name="classYear"
              value={form.classYear}
              onChange={handleChange}
              required
            >
              <option value="">Select your current year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
              <option value="Other">Other</option>
            </select>
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
            {loading ? "Creating account..." : "Create Account →"}
          </button>
        </form>

        <p className="form-footer">
          Your account information will be saved to the CampusSkillSwap
          backend.
        </p>
      </section>
    </main>
  );
}

export default Register;