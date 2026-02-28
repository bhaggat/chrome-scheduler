import "./SchedulerForm.css";

export default function HelpModal({ onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onCancel}>
          &times;
        </button>
        <h2>How to Use</h2>
        <div
          className="help-content"
          style={{ textAlign: "left", lineHeight: "1.6", color: "#4a5568" }}
        >
          <section style={{ marginBottom: "15px" }}>
            <h3 style={{ color: "#2d3748", marginBottom: "8px" }}>
              📅 Create a Scheduler
            </h3>
            <p>
              Click the <strong>+</strong> button to add a new task. You can
              schedule websites to open automatically based on different
              triggers.
            </p>
          </section>

          <section style={{ marginBottom: "15px" }}>
            <h3 style={{ color: "#2d3748", marginBottom: "8px" }}>
              ⚡ Trigger Types
            </h3>
            <ul style={{ paddingLeft: "20px", margin: "0" }}>
              <li>
                <strong>Specific Date & Time:</strong> Opens the URL at an exact
                date and time.
              </li>
              <li>
                <strong>On Scheduled Time:</strong> Sets a daily recurring time
                for the website to open.
              </li>
              <li>
                <strong>Everytime on Chrome Start:</strong> Opens the URL
                whenever you launch Chrome.
              </li>
            </ul>
          </section>

          <section style={{ marginBottom: "15px" }}>
            <h3 style={{ color: "#2d3748", marginBottom: "8px" }}>
              ⚙️ Settings
            </h3>
            <p>
              Use the Settings menu to configure global preferences, such as
              enabling a &quot;Checkout Reminder&quot; popup when you close
              Chrome.
            </p>
          </section>

          <section
            style={{
              marginTop: "20px",
              padding: "12px",
              background: "#fff5f5",
              borderRadius: "8px",
              border: "1px solid #fed7d7",
            }}
          >
            <h4
              style={{
                color: "#c53030",
                margin: "0 0 5px 0",
                fontSize: "0.95rem",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              Important Note
            </h4>
            <p style={{ margin: 0, fontSize: "0.9rem", color: "#742a2a" }}>
              The scheduler works only when Chrome is running. If you close
              Chrome, scheduled tasks will not execute until you open it again.
            </p>
          </section>
        </div>

        <div className="footer">
          <button
            className="cancel-button"
            onClick={onCancel}
            style={{ width: "100%" }}
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
