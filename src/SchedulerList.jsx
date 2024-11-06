import React from "react";
import "./SchedulerList.css";
import { version } from "./content";

export default function SchedulerList({ schedulers, onDelete, onEdit }) {
  return (
    <div className="scheduler-list">
      <header>
        <h2>Schedulers</h2>
        <button
          className="add-button"
          onClick={() => onEdit({})}
          disabled={schedulers?.length >= 10}
        >
          + Add New Scheduler
        </button>
      </header>
      {schedulers?.length ? (
        <ul className="list">
          {schedulers.map((scheduler) => (
            <li key={scheduler.id} className="list-item">
              <div className="scheduler-info">
                <p>
                  <a
                    href={scheduler.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {scheduler.title}
                  </a>
                </p>
                <div className="chips">
                  <span className="chip">{scheduler.type}</span>
                  <span className="chip">
                    {scheduler.triggerType === "Everytime on chrome open"
                      ? "Everytime"
                      : scheduler.triggerType}
                  </span>
                </div>
              </div>
              <div className="action-buttons">
                <button
                  className="edit-button"
                  onClick={() => onEdit(scheduler)}
                  aria-label="Edit"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                    fill="currentColor"
                  >
                    <path d="M3 17.25V21h3.75l11-11.03-3.75-3.75L3 17.25zm17.71-10.04a1.004 1.004 0 0 0 0-1.42l-2.34-2.34a1.004 1.004 0 0 0-1.42 0L15.13 4.71l3.75 3.75 1.83-1.83z" />
                  </svg>
                </button>
                <button
                  className="delete-button"
                  onClick={() => onDelete(scheduler.id)}
                  aria-label="Delete"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                    fill="currentColor"
                  >
                    <path d="M16 9v10H8V9h8m-1.5-6h-5L9 4H4v2h16V4h-5l-1.5-1z" />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty">No schedulers added yet</div>
      )}
      <div className="version">Version {version}</div>
    </div>
  );
}
