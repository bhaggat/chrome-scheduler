import { useState, useLayoutEffect } from "react";
import "./SchedulerForm.css";
import { isDev } from "./content";

export default function SchedulerForm({ scheduler, onSubmit, onCancel }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [afterTime, setAfterTime] = useState("");
  const [beforeTime, setBeforeTime] = useState("");
  const [type, setType] = useState("Daily");
  const [triggerType, setTriggerType] = useState("Everytime on chrome open");
  const [shouldPin, setShouldPin] = useState(false);
  const [focusOnOpen, setFocusOnOpen] = useState(true);

  useLayoutEffect(() => {
    if (Object.keys(scheduler)?.length) {
      setUrl(scheduler.url);
      setTitle(scheduler.title);
      setAfterTime(scheduler.afterTime);
      setBeforeTime(scheduler.beforeTime);
      setType(scheduler.type);
      setTriggerType(scheduler.triggerType);
      setShouldPin(scheduler.shouldPin);
      setFocusOnOpen(
        typeof scheduler.focusOnOpen === "boolean"
          ? scheduler.focusOnOpen
          : true,
      );
    } else {
      if (isDev) {
        setTitle("Dhruv Portfolio");
        setUrl("https://bhaggat.github.io/portfolio/");
      } else {
        if (typeof chrome !== "undefined" && chrome.tabs && chrome.tabs.query) {
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const currentTab = tabs[0];
            setTitle(currentTab.title || "");
            setUrl(currentTab.url || "");
            setShouldPin(currentTab.pinned || false);
            setFocusOnOpen(true);
          });
        }
      }
    }
  }, [scheduler]);

  const handleSubmit = () => {
    onSubmit({
      id: scheduler?.id,
      title,
      url,
      afterTime,
      beforeTime,
      type,
      triggerType,
      shouldPin,
      focusOnOpen,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onCancel}>
          &times;
        </button>
        <h2>{scheduler ? "Edit" : "Add"} Scheduler</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          autoFocus={true}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="url"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option>Daily</option>
          <option>Weekly</option>
          <option>Monthly</option>
          <option>Yearly</option>
        </select>
        <select
          value={triggerType}
          onChange={(e) => setTriggerType(e.target.value)}
        >
          <option>Everytime on chrome open</option>
          <option>Once per day</option>
        </select>
        <input
          type="datetime-local"
          placeholder="After Time"
          value={afterTime}
          onChange={(e) => setAfterTime(e.target.value)}
        />
        <input
          type="datetime-local"
          placeholder="Before Time"
          value={beforeTime}
          onChange={(e) => setBeforeTime(e.target.value)}
        />
        <div className="checkbox-container">
          <input
            type="checkbox"
            id="should-pin"
            checked={shouldPin}
            onChange={(e) => setShouldPin(e.target.checked)}
          />
          <label htmlFor="should-pin">Should Pin</label>
        </div>
        <div className="checkbox-container">
          <input
            type="checkbox"
            id="focus-on-open"
            checked={focusOnOpen}
            onChange={(e) => setFocusOnOpen(e.target.checked)}
          />
          <label htmlFor="focus-on-open">Focus on open</label>
        </div>
        <div className="footer">
          <button
            className="save-button"
            onClick={handleSubmit}
            aria-label="Save"
            title="Save"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="currentColor"
            >
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </button>
          <button
            className="cancel-button"
            onClick={onCancel}
            aria-label="Cancel"
            title="Cancel"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="currentColor"
            >
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
