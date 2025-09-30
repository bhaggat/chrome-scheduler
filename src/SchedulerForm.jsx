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

  useLayoutEffect(() => {
    if (Object.keys(scheduler)?.length) {
      setUrl(scheduler.url);
      setTitle(scheduler.title);
      setAfterTime(scheduler.afterTime);
      setBeforeTime(scheduler.beforeTime);
      setType(scheduler.type);
      setTriggerType(scheduler.triggerType);
      setShouldPin(scheduler.shouldPin);
    } else {
      if (isDev) {
        setTitle("Webosmotic");
        setUrl("https://www.webosmotic.com");
      } else {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const currentTab = tabs[0];
          setTitle(currentTab.title);
          setUrl(currentTab.url);
          setShouldPin(currentTab.pinned);
        });
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
        <div className="footer">
          <button className="save-button" onClick={handleSubmit}>
            Save
          </button>
          <button className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
