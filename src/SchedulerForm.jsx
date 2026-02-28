import { useState, useLayoutEffect } from "react";
import "./SchedulerForm.css";
import { isDev } from "./content";
import { getFormDefaults, saveFormDefaults } from "./utils";

export default function SchedulerForm({ scheduler, onSubmit, onCancel }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [afterTime, setAfterTime] = useState("");
  const [beforeTime, setBeforeTime] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [type, setType] = useState("Daily");
  const [triggerType, setTriggerType] = useState("On Scheduled time");
  const [shouldPin, setShouldPin] = useState(false);
  const [focusOnOpen, setFocusOnOpen] = useState(false);

  const toLocalInputVal = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    const pad = (n) => n.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const toUTCString = (localString) => {
    if (!localString) return "";
    const date = new Date(localString);
    if (isNaN(date.getTime())) return localString;
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date.toISOString();
  };

  const getNextMinute = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1);
    now.setSeconds(0, 0);
    const pad = (n) => n.toString().padStart(2, "0");
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  };

  useLayoutEffect(() => {
    if (Object.keys(scheduler)?.length) {
      setUrl(scheduler.url);
      setTitle(scheduler.title);
      setAfterTime(toLocalInputVal(scheduler.afterTime));
      setBeforeTime(toLocalInputVal(scheduler.beforeTime));
      setScheduledTime(toLocalInputVal(scheduler.scheduledTime));
      setType(scheduler.type);
      setTriggerType(scheduler.triggerType);
      setShouldPin(scheduler.shouldPin);
      setFocusOnOpen(
        typeof scheduler.focusOnOpen === "boolean"
          ? scheduler.focusOnOpen
          : true,
      );
    } else {
      setScheduledTime(getNextMinute());

      getFormDefaults().then((defaults) => {
        if (defaults.type) setType(defaults.type);
        if (defaults.triggerType) {
          setTriggerType(defaults.triggerType);
          if (defaults.triggerType === "On Scheduled time") {
            setScheduledTime(getNextMinute());
          }
        }
        if (typeof defaults.shouldPin === "boolean")
          setShouldPin(defaults.shouldPin);
        if (typeof defaults.focusOnOpen === "boolean")
          setFocusOnOpen(defaults.focusOnOpen);
      });

      if (isDev) {
        setTitle("Dhruv Portfolio");
        setUrl("https://bhaggat.github.io/portfolio/");
      } else {
        if (typeof chrome !== "undefined" && chrome.tabs && chrome.tabs.query) {
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const currentTab = tabs[0];
            setTitle(currentTab.title || "");
            setUrl(currentTab.url || "");
            // Removed overriding shouldPin and focusOnOpen here to respect saved defaults
          });
        }
      }
    }
  }, [scheduler]);

  const handleSubmit = () => {
    saveFormDefaults({
      type,
      triggerType,
      shouldPin,
      focusOnOpen,
    }); // Save defaults on submit

    onSubmit({
      id: scheduler?.id,
      title,
      url,
      afterTime: toUTCString(afterTime),
      beforeTime: toUTCString(beforeTime),
      scheduledTime: toUTCString(scheduledTime),
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
        <h2>{scheduler?.id ? "Edit" : "Add"} Scheduler</h2>
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
          onChange={(e) => {
            const val = e.target.value;
            setTriggerType(val);
            if (val === "On Scheduled time") {
              setScheduledTime(getNextMinute());
            }
          }}
        >
          <option>On Scheduled time</option>
          <option>Everytime on chrome open</option>
          <option>Once per day</option>
        </select>
        {triggerType === "On Scheduled time" ? (
          <input
            type="datetime-local"
            placeholder="Scheduled Time"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
          />
        ) : (
          <>
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
          </>
        )}
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
