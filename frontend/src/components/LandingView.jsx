import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  ArrowRight,
  Award,
  BarChart3,
  Brain,
  Check,
  CheckCircle2,
  CheckSquare,
  ChevronRight,
  Clock,
  Code,
  Cpu,
  ExternalLink,
  FileText,
  Filter,
  Folder,
  FolderOpen,
  Layers,
  List,
  Loader2,
  LogIn,
  PlusCircle,
  RotateCcw,
  Search,
  ShieldCheck,
  Terminal,
  Youtube,
  Zap
} from 'lucide-react';

const LandingView = ({ setCurrentView }) => {
  const [activeTab, setActiveTab] = useState('sheet');

  // Interactive state for Demo Tab 1 (Question Row)
  const [demoQuestionDone, setDemoQuestionDone] = useState(false);
  const [demoRevisions, setDemoRevisions] = useState(3);

  return (
    <div className="landing-super-container">
      {/* Ambient Glows */}
      <div className="landing-glow landing-glow-1"></div>
      <div className="landing-glow landing-glow-2"></div>

      {/* 1. HERO SECTION */}
      <section className="landing-hero-v2">
     

        <h1 className="landing-title-v2">
          Track DSA & Master Interviews <span className="gradient-text">With AI Help</span>
        </h1>

        <p className="landing-subtitle-v2">
          Save any question from Codeforces, CodeChef, GeeksforGeeks, LeetCode, manage all good questions in one place, and track revision.
        </p>

        <div className="landing-actions-v2">
          <button
            className="btn btn-primary btn-hero-lg"
            onClick={() => setCurrentView('signup')}
            id="hero-signup-btn"
          >
            <span>Get Started Free</span>
            <ArrowRight size={18} />
          </button>
          <button
            className="btn btn-secondary btn-hero-lg"
            onClick={() => setCurrentView('login')}
            id="hero-login-btn"
          >
            <LogIn size={18} />
            <span>Sign In to Account</span>
          </button>
        </div>

        {/* Quick Trust Highlights */}
        <div className="hero-trust-grid">
          <div className="trust-item">
            <CheckCircle2 size={16} className="text-easy" />
            <span>100% Free Account</span>
          </div>
          <div className="trust-item">
            <CheckCircle2 size={16} className="text-easy" />
            <span>AI Integrated</span>
          </div>
          <div className="trust-item">
            <CheckCircle2 size={16} className="text-easy" />
            <span>Spaced Repetition</span>
          </div>
          <div className="trust-item">
            <CheckCircle2 size={16} className="text-easy" />
            <span>Folder & List View</span>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE DEMO SHOWCASE (LIVE PRODUCT SANDBOX) */}
      <section className="demo-showcase-section">
        <div className="section-header-centered">
          <div className="section-badge">INTERACTIVE DEMO</div>
          <h2>Experience LeetTracker In Action</h2>
          <p>Click through the live interactive preview tabs below to explore how LeetTracker streamlines your interview prep.</p>
        </div>

        <div className="demo-card-container">
          {/* Demo Navigation Tabs */}
          <div className="demo-tabs-bar">
            <button
              className={`demo-tab-btn ${activeTab === 'sheet' ? 'active' : ''}`}
              onClick={() => setActiveTab('sheet')}
            >
              <List size={16} />
              <span>Interactive Sheet & Spaced Repetition</span>
            </button>

            <button
              className={`demo-tab-btn ${activeTab === 'folders' ? 'active' : ''}`}
              onClick={() => setActiveTab('folders')}
            >
              <Folder size={16} />
              <span>Topic Folder View</span>
            </button>
          </div>

          {/* Demo Screen Window Header */}
          <div className="demo-window-header">
            <div className="window-dots">
              <span className="dot dot-red"></span>
              <span className="dot dot-yellow"></span>
              <span className="dot dot-green"></span>
            </div>
            <div className="window-url-bar">
              <ShieldCheck size={14} className="text-easy" />
              <span>https://myowndsatracker.vercel.app/</span>
            </div>
            <div className="window-status-pill">
              <span className="status-dot"></span> LIVE PREVIEW
            </div>
          </div>

          {/* Tab 1: Interactive Sheet & Revision Demo */}
          {activeTab === 'sheet' && (
            <div className="demo-window-body">
              <div className="demo-toolbar-mock">
                <div className="demo-search-mock">
                  <Search size={14} />
                  <span>Search "Two Pointers" or "Median"...</span>
                </div>
                <div className="demo-filters-mock">
                  <span className="mock-badge">Topic: All</span>
                  <span className="mock-badge">Difficulty: Hard</span>
                  <span className="mock-badge">Sort: Revisions</span>
                </div>
              </div>

              <div className="demo-table-mock">
                <div className="demo-table-row header-row">
                  <div className="col-status">Status</div>
                  <div className="col-title">Problem Title</div>
                  <div className="col-topic">Topic</div>
                  <div className="col-difficulty">Difficulty</div>
                  <div className="col-timetaken">Time</div>
                  <div className="col-revisions">SRS Revisions</div>
                  <div className="col-notes">Note</div>
                </div>

                {/* Interactive Row 1 */}
                <div className={`demo-table-row ${demoQuestionDone ? 'solved' : ''}`}>
                  <div className="col-status">
                    <button
                      className="btn-done-toggle"
                      onClick={() => setDemoQuestionDone(!demoQuestionDone)}
                      title="Click to toggle solved status"
                      style={{
                        backgroundColor: demoQuestionDone ? 'var(--color-success)' : 'transparent',
                        borderColor: demoQuestionDone ? 'var(--color-success)' : 'var(--color-text-muted)'
                      }}
                    >
                      <Check size={12} style={{ color: demoQuestionDone ? '#000' : 'transparent', strokeWidth: 4 }} />
                    </button>
                  </div>
                  <div className="col-title col-title-demo">
                    <span className="demo-problem-name">4. Median of Two Sorted Arrays</span>
                    <ExternalLink size={13} className="text-accent" />
                  </div>
                  <div className="col-topic">
                    <span className="topic-badge">Binary Search</span>
                  </div>

                  <div className="card-metrics-grid">
                    <div className="col-difficulty">
                      <span className="diff-badge hard">Hard</span>
                    </div>
                    <div className="col-timetaken">
                      <span className="timetaken-badge">24.5 min</span>
                    </div>
                    <div className="col-revisions">
                      <div className="revisions-counter">
                        <button
                          className="btn-counter"
                          onClick={() => setDemoRevisions(Math.max(0, demoRevisions - 1))}
                          disabled={demoRevisions <= 0}
                        >
                          -
                        </button>
                        <span className="revisions-count">{demoRevisions}</span>
                        <button
                          className="btn-counter"
                          onClick={() => setDemoRevisions(demoRevisions + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="col-notes">
                      <div className="btn-icon-note has-notes">
                        <FileText size={15} />
                        <span className="notes-indicator-dot"></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Non-interactive Row 2 */}
                <div className="demo-table-row solved">
                  <div className="col-status">
                    <div className="btn-done-toggle" style={{ backgroundColor: 'var(--color-success)', borderColor: 'var(--color-success)' }}>
                      <Check size={12} style={{ color: '#000', strokeWidth: 4 }} />
                    </div>
                  </div>
                  <div className="col-title col-title-demo">
                    <span className="demo-problem-name">15. 3Sum</span>
                    <ExternalLink size={13} className="text-accent" />
                  </div>
                  <div className="col-topic">
                    <span className="topic-badge">Two Pointers</span>
                  </div>

                  <div className="card-metrics-grid">
                    <div className="col-difficulty">
                      <span className="diff-badge medium">Medium</span>
                    </div>
                    <div className="col-timetaken">
                      <span className="timetaken-badge">15 min</span>
                    </div>
                    <div className="col-revisions">
                      <div className="revisions-counter">
                        <span className="btn-counter">-</span>
                        <span className="revisions-count">5</span>
                        <span className="btn-counter">+</span>
                      </div>
                    </div>
                    <div className="col-notes">
                      <div className="btn-icon-note has-notes">
                        <FileText size={15} />
                        <span className="notes-indicator-dot"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="demo-interactive-prompt">
                <span><strong>Try it out:</strong> Click the checkbox or (+ / -) counter above to test live progress tracking!</span>
              </div>
            </div>
          )}

          {/* Tab 2: Folder View Demo */}

          {/* Tab 3: Folder View Demo */}
          {activeTab === 'folders' && (
            <div className="demo-window-body">
              <div className="demo-folders-grid">
                <div className="folder-card-demo">
                  <div className="folder-card-header">
                    <div className="folder-icon-wrapper">
                      <Folder size={20} />
                    </div>
                    <span className="folder-badge">12 Questions</span>
                  </div>
                  <h4 className="folder-title">Arrays & Hashing</h4>
                  <div className="folder-stats">
                    <span>Progress: 10/12 Solved</span>
                    <span className="folder-stat-percent">83%</span>
                  </div>
                  <div className="folder-progress-bar">
                    <div className="folder-progress-fill" style={{ width: '83%' }}></div>
                  </div>
                  <div className="folder-difficulty-distribution">
                    <span className="dist-badge easy">Easy: 4</span>
                    <span className="dist-badge medium">Medium: 6</span>
                    <span className="dist-badge hard">Hard: 2</span>
                  </div>
                </div>

                <div className="folder-card-demo">
                  <div className="folder-card-header">
                    <div className="folder-icon-wrapper">
                      <Folder size={20} />
                    </div>
                    <span className="folder-badge">15 Questions</span>
                  </div>
                  <h4 className="folder-title">Dynamic Programming</h4>
                  <div className="folder-stats">
                    <span>Progress: 8/15 Solved</span>
                    <span className="folder-stat-percent">53%</span>
                  </div>
                  <div className="folder-progress-bar">
                    <div className="folder-progress-fill" style={{ width: '53%' }}></div>
                  </div>
                  <div className="folder-difficulty-distribution">
                    <span className="dist-badge easy">Easy: 2</span>
                    <span className="dist-badge medium">Medium: 8</span>
                    <span className="dist-badge hard">Hard: 5</span>
                  </div>
                </div>

                <div className="folder-card-demo">
                  <div className="folder-card-header">
                    <div className="folder-icon-wrapper">
                      <Folder size={20} />
                    </div>
                    <span className="folder-badge">9 Questions</span>
                  </div>
                  <h4 className="folder-title">Graphs & Trees</h4>
                  <div className="folder-stats">
                    <span>Progress: 6/9 Solved</span>
                    <span className="folder-stat-percent">67%</span>
                  </div>
                  <div className="folder-progress-bar">
                    <div className="folder-progress-fill" style={{ width: '67%' }}></div>
                  </div>
                  <div className="folder-difficulty-distribution">
                    <span className="dist-badge easy">Easy: 3</span>
                    <span className="dist-badge medium">Medium: 4</span>
                    <span className="dist-badge hard">Hard: 2</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      

      {/* 4. CORE FEATURES GRID (6 RICH GLASS CARDS) */}
      <section className="landing-features-v2">
        <div className="section-header-centered">
          
          <h2>Built specifically for engineers aiming to conquer DSA interviews</h2>
          <p>Everything you need to organize your study plan, retain solutions long-term, and stay interview ready.</p>
        </div>

        <div className="features-grid-v2">
          {/* Feature 1 */}
          <div className="feature-card-v2">
            <div className="feature-card-icon">
              <Brain size={26} />
            </div>
            <h3>AI Note Refiner & Complexity Analysis</h3>
            <p>
              Write quick raw notes after solving a problem. Let AI fix grammar, format complexity bounds, and highlight key edge cases without altering your logic.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="feature-card-v2">
            <div className="feature-card-icon">
              <FolderOpen size={26} />
            </div>
            <h3>Dual View: List & Folder Grid</h3>
            <p>
              Switch seamlessly between a sleek List Table and interactive Folder Cards. View topic-wise completion percentages and difficulty distributions at a glance.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="feature-card-v2">
            <div className="feature-card-icon">
              <RotateCcw size={26} />
            </div>
            <h3>Spaced Repetition (SRS) Tracker</h3>
            <p>
              Don't forget solved questions! Increment your revision counter every time you review a problem to solidify algorithmic patterns in memory.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="feature-card-v2">
            <div className="feature-card-icon">
              <Clock size={26} />
            </div>
            <h3>Solving Time & YouTube Embeds</h3>
            <p>
              Log exact solving duration in minutes and link your favorite YouTube explanation videos directly to every question row for instant reference.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="feature-card-v2">
            <div className="feature-card-icon">
              <Filter size={26} />
            </div>
            <h3>Smart Search & Easy Filters</h3>
            <p>
              Quickly filter your questions by topic, difficulty, or solved status. Sort your list by title, time spent, or revision count in one click.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="feature-card-v2">
            <div className="feature-card-icon">
              <ShieldCheck size={26} />
            </div>
            <h3>Private Account & Easy Reset</h3>
            <p>
              Your progress and notes stay completely safe and private to your account. Easily reset your sheet progress whenever you want a fresh start.
            </p>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS (3-STEP PROCESS) */}
      <section className="workflow-section">
        <div className="section-header-centered">
          <div className="section-badge">WORKFLOW</div>
          <h2>3 Simple Steps to Interview Mastery</h2>
        </div>

        <div className="workflow-steps-grid">
          <div className="workflow-step-card">
            <div className="step-number">01</div>
            <h3>Build Sheet</h3>
            <p>Create questions with custom titles, problem URLs (LeetCode, Codeforces, CodeChef, GeeksforGeeks), topics, YouTube solution links, and target difficulties.</p>
          </div>

          <div className="workflow-step-card">
            <div className="step-number">02</div>
            <h3>Solve & Refine Notes with AI</h3>
            <p>Record your solving time, mark status as done, and use AI to polish approaches and complexities into clean notes.</p>
          </div>

          <div className="workflow-step-card">
            <div className="step-number">03</div>
            <h3>Revise with SRS Counters</h3>
            <p>Track revision passes with spaced repetition counters, ensuring zero knowledge decay when interview day arrives.</p>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="landing-cta-banner">
        <div className="cta-banner-content">
          <h2>Ready to Level Up Your DSA Preparation?</h2>
          <p>Create your free account today and start tracking your algorithmic journey with AI power.</p>
          <div className="cta-banner-buttons">
            <button
              className="btn btn-primary btn-hero-lg"
              onClick={() => setCurrentView('signup')}
              id="cta-signup-btn"
            >
              <span>Create Free Account</span>
              <ArrowRight size={18} />
            </button>
            <button
              className="btn btn-secondary btn-hero-lg"
              onClick={() => setCurrentView('login')}
              id="cta-login-btn"
            >
              <LogIn size={18} />
              <span>Sign In</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingView;
