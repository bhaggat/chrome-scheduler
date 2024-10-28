export default function SchedulerList({ schedulers, onDelete, onEdit }) {
  return (
    <div>
      <h2>Schedulers</h2>
      <button onClick={() => onEdit(null)}>Add New Scheduler</button>
      <ul>
        {schedulers.map((scheduler) => (
          <li key={scheduler.id}>
            {scheduler.url} - {scheduler.type} - {scheduler.triggerType}
            <button onClick={() => onEdit(scheduler)}>Edit</button>
            <button onClick={() => onDelete(scheduler.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
