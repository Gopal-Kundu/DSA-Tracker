import React from 'react';
import { Check, Edit, ExternalLink, FileText, Trash2, Youtube } from 'lucide-react';

const QuestionRow = ({
  q,
  toggleQuestionStatus,
  openNotesModal,
  handleUpdateRevisions,
  handleEditClick,
  handleDeleteClick
}) => {
  const qId = q._id || q.id;

  return (
    <div className={`question-row difficulty-${q.difficulty.toLowerCase()} ${q.done ? 'solved' : ''}`}>
      <div className="col-status">
        <button className="btn-done-toggle" onClick={() => toggleQuestionStatus(qId)}>
          <Check size={12} strokeWidth={4} />
        </button>
      </div>

      <div className="col-title">
        <a
          href={q.link}
          target="_blank"
          rel="noopener noreferrer"
          className="question-link"
          title={q.name}
        >
          <span>{q.name}</span>
          <ExternalLink className="question-link-icon" size={14} />
        </a>
      </div>

      <div className="col-topic">
        <span className="topic-badge">{q.topic}</span>
      </div>

      <div className="card-metrics-grid">
        <div className="col-notes">
          <button
            className={`btn-icon-note ${q.notes ? 'has-notes' : ''}`}
            onClick={() => openNotesModal(q)}
            title={q.notes ? "View / Edit Note" : "Write Note"}
          >
            <FileText size={16} />
            {q.notes && <span className="notes-indicator-dot"></span>}
          </button>
        </div>

        <div className="col-difficulty">
          <span className={`diff-badge ${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
        </div>

        <div className="col-timetaken">
          <span className="timetaken-badge">{q.timeTaken ? `${Math.round(q.timeTaken * 100) / 100} min` : 'N/A'}</span>
        </div>

        <div className="col-youtube">
          {q.youtube ? (
            <a
              href={q.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="youtube-link"
              title="Watch solution on YouTube"
            >
              <Youtube size={18} />
            </a>
          ) : "N/A"}
        </div>

        <div className="col-revisions">
          <div className="revisions-counter">
            <button
              className="btn-counter btn-counter-minus"
              onClick={() => handleUpdateRevisions(qId, (q.revisions || 0) - 1)}
              disabled={(q.revisions || 0) <= 0}
              title="Decrement revisions"
            >
              -
            </button>
            <span className="revisions-count">{q.revisions || 0}</span>
            <button
              className="btn-counter btn-counter-plus"
              onClick={() => handleUpdateRevisions(qId, (q.revisions || 0) + 1)}
              title="Increment revisions"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="col-action">
        <button className="btn-edit" title="Edit this question" onClick={() => handleEditClick(q)}>
          <Edit size={16} />
        </button>
        <button className="btn-delete" title="Delete this question" onClick={() => handleDeleteClick(q)}>
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default React.memo(QuestionRow);
