import React, { useState, useEffect, useLayoutEffect } from "react";
import "./SchedulerForm.css";
import { isDev } from "./content";

export default function SchedulerForm({ scheduler, onSubmit, onCancel }) {
  const [url, setUrl] = useState("");
  const [afterTime, setAfterTime] = useState("");
  const [beforeTime, setBeforeTime] = useState("");
  const [type, setType] = useState("Daily");
  const [triggerType, setTriggerType] = useState("Everytime");

  useLayoutEffect(() => {
    if (Object.keys(scheduler)?.length) {
      setUrl(scheduler.url);
      setAfterTime(scheduler.afterTime);
      setBeforeTime(scheduler.beforeTime);
      setType(scheduler.type);
      setTriggerType(scheduler.triggerType);
    } else {
      if (isDev) {
        setUrl("https://www.webosmotic.com");
      } else {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const currentTab = tabs[0];
          setUrl(currentTab.url);
        });
      }
    }
  }, [scheduler]);

  const handleSubmit = () => {
    onSubmit({
      id: scheduler?.id,
      url,
      afterTime,
      beforeTime,
      type,
      triggerType,
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
          type="url"
          placeholder="URL"
          value={url}
          autoFocus={true}
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
        <div className="footer">
          <button onClick={handleSubmit}>Save</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
