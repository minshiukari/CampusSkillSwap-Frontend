import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <header className="page-container page-header">
        <a className="brand" href="/" aria-label="CampusSkillSwap home">
          <span className="brand-mark">C</span>
          <span>CampusSkillSwap</span>
        </a>

        <button
          type="button"
          className="primary-button"
          onClick={() => navigate("/register")}
        >
          Get Started
        </button>
      </header>

      <main>
        <section className="page-container home-hero">
          <div className="hero-content">
            <span className="eyebrow">
              Learn together. Grow together.
            </span>

            <h1 className="hero-title">
              Your skills are
              <br />
              worth <span>sharing.</span>
            </h1>

            <p className="hero-description">
              Connect with students on your campus, learn skills
              from your peers, and share what you already know.
              Your next learning partner could be sitting in your
              classroom.
            </p>

            <div className="hero-actions">
              <button
                type="button"
                className="primary-button"
                onClick={() => navigate("/register")}
              >
                Get Started →
              </button>

              <a className="secondary-button" href="#how-it-works">
                Explore how it works
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-visual-card">
              <span className="eyebrow">Your campus community</span>

              <h3>Skills grow when shared.</h3>

              <p>
                Find people who know what you want to learn.
              </p>

              <div className="hero-skill">
                <div className="hero-skill-icon">↗</div>

                <div>
                  <strong>Learn something new</strong>
                  <small>Connect with a student mentor</small>
                </div>
              </div>

              <div className="hero-skill">
                <div className="hero-skill-icon">＋</div>

                <div>
                  <strong>Share what you know</strong>
                  <small>Help another student grow</small>
                </div>
              </div>

              <div className="hero-skill">
                <div className="hero-skill-icon">⇄</div>

                <div>
                  <strong>Exchange skills</strong>
                  <small>Build a learning community</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="page-container home-section"
        >
          <div className="section-heading">
            <h2>One campus. Countless skills.</h2>

            <p>
              Learn from your peers, teach what you're good at,
              and discover opportunities to grow together.
            </p>
          </div>

          <div className="feature-grid">
            <article className="feature-card">
              <div className="feature-icon">↗</div>

              <h3>Learn</h3>

              <p>
                Find students who can teach you a skill you've
                always wanted to learn.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon">＋</div>

              <h3>Teach</h3>

              <p>
                Share your knowledge and help fellow students
                develop new abilities.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon">⇄</div>

              <h3>Swap</h3>

              <p>
                Connect with people who want to learn what you
                know and can teach what you want to learn.
              </p>
            </article>
          </div>

          <div className="section-heading" style={{ marginTop: 45 }}>
            <button
              type="button"
              className="primary-button"
              onClick={() => navigate("/register")}
            >
              Join CampusSkillSwap →
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;