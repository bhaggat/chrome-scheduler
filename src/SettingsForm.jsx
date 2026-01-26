import { useState, useEffect } from "react";
import "./SchedulerForm.css";
import { getPreferences } from "./utils";

export default function SettingsForm({ onSubmit, onCancel }) {
  const [enabled, setEnabled] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [message, setMessage] = useState(
    "Do you want to checkout before closing Chrome?",
  );
  const [confirmText, setConfirmText] = useState("Checkout");
  const [dismissText, setDismissText] = useState("Dismiss");

  useEffect(() => {
    getPreferences().then((p) => {
      setEnabled(!!p.checkoutReminderEnabled);
      setCheckoutUrl(p.checkoutUrl || "");
      setMessage(
        p.reminderMessage || "Do you want to checkout before closing Chrome?",
      );
      setConfirmText(p.confirmButtonText || "Checkout");
      setDismissText(p.dismissButtonText || "Dismiss");
    });
  }, []);

  const handleSave = () => {
    onSubmit({
      checkoutReminderEnabled: enabled,
      checkoutUrl,
      reminderMessage: message,
      confirmButtonText: confirmText,
      dismissButtonText: dismissText,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onCancel}>
          &times;
        </button>
        <h2>Settings</h2>

        <div className="checkbox-container">
          <input
            type="checkbox"
            id="enable-checkout-reminder"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />
          <label htmlFor="enable-checkout-reminder">
            Show checkout reminder on Chrome close
          </label>
        </div>

        <input
          type="url"
          placeholder="Checkout URL (e.g., https://shop.example.com/checkout)"
          value={checkoutUrl}
          onChange={(e) => setCheckoutUrl(e.target.value)}
        />

        <input
          type="text"
          placeholder="Reminder message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <input
          type="text"
          placeholder="Primary button text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
        />

        <input
          type="text"
          placeholder="Secondary button text"
          value={dismissText}
          onChange={(e) => setDismissText(e.target.value)}
        />

        <div className="footer">
          <button
            className="save-button"
            onClick={handleSave}
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
