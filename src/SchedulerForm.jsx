import { useState, useEffect } from "react";

export default function SchedulerForm({ scheduler, onSubmit, onCancel }) {
  const [url, setUrl] = useState("https://www.webosmotic.com");
  const [afterTime, setAfterTime] = useState("2024-10-28T16:09");
  const [beforeTime, setBeforeTime] = useState("2024-10-28T16:10");
  const [type, setType] = useState("Daily");
  const [triggerType, setTriggerType] = useState("Everytime");

  useEffect(() => {
    if (scheduler) {
      setUrl(scheduler.url);
      setAfterTime(scheduler.afterTime);
      setBeforeTime(scheduler.beforeTime);
      setType(scheduler.type);
      setTriggerType(scheduler.triggerType);
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
    <div>
      <h2>{scheduler ? "Edit" : "Add"} Scheduler</h2>
      <input
        type="url"
        placeholder="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
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
        <option>Everytime</option>
        <option>Once per day</option>
      </select>
      <button onClick={handleSubmit}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
}
