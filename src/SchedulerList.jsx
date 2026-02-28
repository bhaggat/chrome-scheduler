import "./SchedulerList.css";
import { version } from "./content";

export default function SchedulerList({
  schedulers,
  onDelete,
  onEdit,
  onOpenSettings,
  onOpenHelp,
}) {
  return (
    <div className="scheduler-list">
      <header>
        <div className="header-title-container">
          <img src="/icon.png" alt="Logo" className="app-logo" />
          <h2>Schedulers</h2>
        </div>
        <div className="header-actions">
          <button
            className="add-button"
            onClick={() => onEdit({})}
            disabled={schedulers?.length >= 10}
            aria-label="Add New Scheduler"
            title="Add New Scheduler"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="currentColor"
            >
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
          </button>
          <button
            className="add-button"
            onClick={onOpenSettings}
            aria-label="Settings"
            title="Settings"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="currentColor"
            >
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81a.488.488 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
            </svg>
          </button>
          <button
            className="add-button"
            onClick={onOpenHelp}
            aria-label="Help"
            title="How to Use"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
            </svg>
          </button>
        </div>
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
