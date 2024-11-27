import React, { useState, useEffect, useLayoutEffect, useMemo } from "react";
import "./SchedulerForm.css";
import { isDev, postNumber, weeks } from "./content";

import { getLabel } from "./utils";
import customDayjs from "./customDayjs";

function getWeekOfMonth(date) {
  const startOfMonth = date.startOf("month");
  const weekOfYearForDate = date.week();
  const weekOfYearForStartOfMonth = startOfMonth.week();
  return weekOfYearForDate - weekOfYearForStartOfMonth + 1;
}
export default function SchedulerForm({ scheduler, onSubmit, onCancel }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(customDayjs());
  const [url, setUrl] = useState("");
  const [afterTime, setAfterTime] = useState("");
  const [beforeTime, setBeforeTime] = useState("");
  const [type, setType] = useState("Daily");
  const [triggerType, setTriggerType] = useState("Everytime on chrome open");
  const [shouldPin, setShouldPin] = useState(false);
  const repeatOptions = useMemo(() => {
    const repeats = [
      "Do Not Repeat",
      "Daily",
      "Weekly",
      "Monthly",
      "Yearly",
    ].map((repeatType) => {
      return {
        value: repeatType,
        label: getLabel(date, repeatType),
      };
    });
    const weekOfMonth = getWeekOfMonth(date);
    if (weekOfMonth) {
      const repeatType = `week-${weekOfMonth}:day-${date.day()}:custom`;
      repeats.push({
        value: repeatType,
        label: getLabel(date, repeatType),
      });
    }
    return repeats;
  }, [date]);

  useLayoutEffect(() => {
    if (Object.keys(scheduler)?.length) {
      setUrl(scheduler.url);
      setTitle(scheduler.title);
      setAfterTime(scheduler.afterTime);
      setBeforeTime(scheduler.beforeTime);
      setType(scheduler.type);
      setTriggerType(scheduler.triggerType);
      setShouldPin(scheduler.shouldPin);
      setDate(customDayjs(scheduler.date));
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
      date: customDayjs(date).format("YYYY-MM-DD"),
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onCancel}>
          &times;
        </button>
        <h2>{scheduler ? "Edit" : "Add"} Scheduler</h2>
        <div className="formRow">
          <label htmlFor="title">Title*</label>
          <input
            id="title"
            type="text"
            placeholder="Enter Title"
            value={title}
            required
            autoFocus={true}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="formRow">
          <label htmlFor="url">URL*</label>
          <input
            type="url"
            id="url"
            placeholder="Enter URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <div className="formRow">
          <label htmlFor="date">Date (On & After)*</label>
          <input
            type="date"
            id="date"
            placeholder="Select Date"
            value={date.format("YYYY-MM-DD")}
            onChange={(e) => {
              console.log("e.target.value", e.target.value);
              setDate(customDayjs(e.target.value));
            }}
          />
        </div>
        <div className="formRow">
          <label htmlFor="repeat">Repeat*</label>
          <select
            value={type}
            id="repeat"
            onChange={(e) => setType(e.target.value)}
          >
            {repeatOptions.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="formRow">
          <label htmlFor="triggerType">Trigger Type*</label>
          <select
            id="triggerType"
            value={triggerType}
            onChange={(e) => setTriggerType(e.target.value)}
          >
            <option>Everytime on chrome open</option>
            <option>Once per day</option>
          </select>
        </div>
        <div className="formRow">
          <label>Between</label>
          <div id="afterTime" className="timepicker">
            <input
              id="afterTime"
              type="time"
              placeholder="After Time"
              value={afterTime}
              onChange={(e) => setAfterTime(e.target.value)}
            />
            <input
              type="time"
              placeholder="Before Time"
              value={beforeTime}
              onChange={(e) => setBeforeTime(e.target.value)}
            />
          </div>
        </div>
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
