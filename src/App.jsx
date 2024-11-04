import { useState, useEffect } from "react";
import SchedulerForm from "./SchedulerForm";
import SchedulerList from "./SchedulerList";
import { getSchedulers, saveSchedulers } from "./utils";
import "./App.css";

export default function App() {
  const [schedulers, setSchedulers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  console.log("showModal", showModal);
  const handleOpenModal = (s) => setShowModal(s);
  const handleCloseModal = () => setShowModal(null);

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
    handleCloseModal();
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
        onEdit={handleOpenModal}
      />
      {!!showModal && (
        <SchedulerForm
          scheduler={showModal}
          onSubmit={addOrUpdateScheduler}
          onCancel={handleCloseModal}
        />
      )}
    </div>
  );
}
