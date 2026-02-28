import { useState, useEffect } from "react";
import SchedulerForm from "./SchedulerForm";
import SchedulerList from "./SchedulerList";
import "./App.css";
import { getSchedulers, saveSchedulers, savePreferences } from "./utils";
import SettingsForm from "./SettingsForm";
import HelpModal from "./HelpModal";
import { Toaster, toast } from "react-hot-toast";

export default function App() {
  const [schedulers, setSchedulers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  console.log("showModal", showModal);
  const handleOpenModal = (s) => setShowModal(s);
  const handleCloseModal = () => setShowModal(null);
  const handleOpenSettings = () => setShowSettings(true);
  const handleCloseSettings = () => setShowSettings(false);
  const handleOpenHelp = () => setShowHelp(true);
  const handleCloseHelp = () => setShowHelp(false);

  useEffect(() => {
    getSchedulers().then(setSchedulers);
  }, []);

  const addOrUpdateScheduler = (scheduler) => {
    const isEdit = !!scheduler.id;
    const updated = scheduler.id
      ? schedulers.map((s) => (s.id === scheduler.id ? scheduler : s))
      : [...schedulers, { ...scheduler, id: Date.now().toString() }];
    setSchedulers(updated);
    saveSchedulers(updated);
    handleCloseModal();
    toast.success(
      isEdit
        ? "Scheduler updated successfully"
        : "Scheduler created successfully",
    );
  };

  const deleteScheduler = (id) => {
    const updated = schedulers.filter((s) => s.id !== id);
    setSchedulers(updated);
    saveSchedulers(updated);
    toast.success("Scheduler deleted successfully");
  };

  return (
    <div className="app-container">
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
      <SchedulerList
        schedulers={schedulers}
        onDelete={deleteScheduler}
        onEdit={handleOpenModal}
        onOpenSettings={handleOpenSettings}
        onOpenHelp={handleOpenHelp}
      />
      {!!showModal && (
        <SchedulerForm
          scheduler={showModal}
          onSubmit={addOrUpdateScheduler}
          onCancel={handleCloseModal}
        />
      )}
      {!!showSettings && (
        <SettingsForm
          onSubmit={(p) => {
            savePreferences(p);
            handleCloseSettings();
            toast.success("Settings saved successfully");
          }}
          onCancel={handleCloseSettings}
        />
      )}
      {!!showHelp && <HelpModal onCancel={handleCloseHelp} />}
    </div>
  );
}
