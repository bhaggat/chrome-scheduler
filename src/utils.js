console.log("chrome? 2", chrome);
export const saveSchedulers = (schedulers) => {
  chrome?.storage?.sync?.set?.({ schedulers });
};

// export const createAlarm = (scheduler) => {
//   console.log("createAlarm called", scheduler);
//   const delay = calculateDelay(scheduler);
//   console.log("***************createAlarmdelay", delay, scheduler.id);
//   chrome?.alarms?.create?(scheduler.id, { delayInMinutes: delay / 60000 });
// };

// export const removeAlarm = (scheduler) => {
//   console.log("createAlarm called", scheduler);
//   const delay = calculateDelay(scheduler);
//   console.log("***************createAlarmdelay", delay, scheduler.id);
//   chrome?.alarms?.create?(scheduler.id, { delayInMinutes: delay / 60000 });
// };

// const calculateDelay = (scheduler) => {
//   const { afterTime, beforeTime, type, triggerType } = scheduler;
//   const now = new Date();
//   const targetTime = new Date(afterTime);
//   if (targetTime < now) targetTime.setDate(targetTime.getDate() + 1);
//   return targetTime - now;
// };

export const getSchedulers = () =>
  new Promise((resolve) => {
    chrome?.storage?.sync?.get?.("schedulers", (data) =>
      resolve(data.schedulers || [])
    );
  });
