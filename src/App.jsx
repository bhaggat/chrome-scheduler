import { useState, useEffect } from "react";
import SchedulerForm from "./SchedulerForm";
import SchedulerList from "./SchedulerList";
import "./App.css";
import { getSchedulers, saveSchedulers } from "./utils";

export default function App() {
  const [schedulers, setSchedulers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const handleOpenModal = (s) => setShowModal(s);
  const handleCloseModal = () => setShowModal(null);

  useEffect(() => {
    getSchedulers().then(setSchedulers);
  }, []);

  const addOrUpdateScheduler = (scheduler) => {
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
