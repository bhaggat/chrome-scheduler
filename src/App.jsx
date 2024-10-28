import { useState, useEffect } from "react";
import SchedulerForm from "./SchedulerForm";
import SchedulerList from "./SchedulerList";
import { getSchedulers, saveSchedulers } from "./utils";

export default function App() {
  const [schedulers, setSchedulers] = useState([]);
  const [selectedScheduler, setSelectedScheduler] = useState(null);

  useEffect(() => {
    getSchedulers().then(setSchedulers);
  }, []);

  const addOrUpdateScheduler = (scheduler) => {
    console.log("addOrUpdateScheduler__________", scheduler);
    const updated = scheduler.id
      ? schedulers.map((s) => (s.id === scheduler.id ? scheduler : s))
      : [...schedulers, { ...scheduler, id: Date.now().toString() }];
    setSchedulers(updated);
    saveSchedulers(updated);
  };

  const deleteScheduler = (id) => {
    const updated = schedulers.filter((s) => s.id !== id);
    setSchedulers(updated);
    saveSchedulers(updated);
  };

  return (
    <div>
      <SchedulerList
        schedulers={schedulers}
        onDelete={deleteScheduler}
        onEdit={(s) => setSelectedScheduler(s)}
      />
      <SchedulerForm
        scheduler={selectedScheduler}
        onSubmit={addOrUpdateScheduler}
        onCancel={() => setSelectedScheduler(null)}
      />
    </div>
  );
}
