import React from 'react';

const HeroStats = ({ stats }) => {
  return (
    <section className="stats-dashboard">
      <div className="stat-progress-card difficulty-easy">
        <div className="card-top">
          <span className="card-title">Easy Difficulty</span>
          <span className="card-stats">{stats.difficulty.Easy.solved} / {stats.difficulty.Easy.total}</span>
        </div>
        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{ width: `${stats.difficulty.Easy.total > 0 ? (stats.difficulty.Easy.solved / stats.difficulty.Easy.total) * 100 : 0}%` }}
          ></div>
        </div>
      </div>

      <div className="stat-progress-card difficulty-medium">
        <div className="card-top">
          <span className="card-title">Medium Difficulty</span>
          <span className="card-stats">{stats.difficulty.Medium.solved} / {stats.difficulty.Medium.total}</span>
        </div>
        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{ width: `${stats.difficulty.Medium.total > 0 ? (stats.difficulty.Medium.solved / stats.difficulty.Medium.total) * 100 : 0}%` }}
          ></div>
        </div>
      </div>

      <div className="stat-progress-card difficulty-hard">
        <div className="card-top">
          <span className="card-title">Hard Difficulty</span>
          <span className="card-stats">{stats.difficulty.Hard.solved} / {stats.difficulty.Hard.total}</span>
        </div>
        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{ width: `${stats.difficulty.Hard.total > 0 ? (stats.difficulty.Hard.solved / stats.difficulty.Hard.total) * 100 : 0}%` }}
          ></div>
        </div>
      </div>
    </section>
  );
};

export default HeroStats;
