import React from "react";
import "./SchedulerList.css";

export default function SchedulerList({ schedulers, onDelete, onEdit }) {
  return (
    <div className="scheduler-list">
      <header>
        <h2>Schedulers</h2>
        <button className="add-button" onClick={() => onEdit({})}>
          + Add New Scheduler
        </button>
      </header>
      <ul className="list">
        {schedulers.map((scheduler) => (
          <li key={scheduler.id} className="list-item">
            <div className="scheduler-info">
              <p>
                <strong>URL:</strong> {scheduler.url}
              </p>
              <p>
                <strong>Type:</strong> {scheduler.type}
              </p>
              <p>
                <strong>Trigger:</strong> {scheduler.triggerType}
              </p>
            </div>
            <div className="action-buttons">
              <button className="edit-button" onClick={() => onEdit(scheduler)}>
                Edit
              </button>
              <button
                className="delete-button"
                onClick={() => onDelete(scheduler.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
