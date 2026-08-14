import React from 'react';
import { Award, Code, Terminal } from 'lucide-react';

const LandingView = ({ setCurrentView, isApiCalling }) => {
  return (
    <div className="landing-container">
      <section className="landing-hero">
        <h2 className="landing-title">Build Your Curated DSA Study Plan</h2>
        <p className="landing-subtitle">
          A premium, high-performance web dashboard built for students and professionals to build custom DSA sheets, track revision progress, and enable lightning-fast lookups.
        </p>
        <div className="landing-actions">
          <button className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1rem' }} onClick={() => setCurrentView('signup')} disabled={isApiCalling}>
            Get Started
          </button>
          <button className="btn btn-secondary" style={{ padding: '1rem 2.5rem', fontSize: '1rem' }} onClick={() => setCurrentView('login')} disabled={isApiCalling}>
            Sign In to Account
          </button>
        </div>
      </section>

      <section className="features-grid">
        <div className="feature-card">
          <div className="feature-icon-wrapper">
            <Terminal size={24} />
          </div>
          <h3>Curate Custom Lists</h3>
          <p>Add your own selected questions, organize them into topics, and build the perfect personal roadmap for your revision goals.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon-wrapper">
            <Award size={24} />
          </div>
          <h3>Progress Isolation</h3>
          <p>Create a secure account to track your individual solving progress, update difficulty details, and add custom entries.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon-wrapper">
            <Code size={24} />
          </div>
          <h3>Analytical Metrics</h3>
          <p>Visualize your progress through interactive charts, easy/medium/hard progress bars, and percentage gauges.</p>
        </div>
      </section>
    </div>
  );
};

export default LandingView;
