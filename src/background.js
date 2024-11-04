chrome.runtime?.onInstalled?.addListener?.(() => {
  console.log("Extension installed!");
});

export const getSchedulers = () =>
  new Promise((resolve) => {
    chrome.storage.sync.get("schedulers", (data) =>
      resolve(data.schedulers || [])
    );
  });

console.log(
  "Helper to check if a URL should be triggered based on type and triggerType"
);

const shouldTrigger = (schedule) => {
  const now = new Date();
  const { type, afterTime, beforeTime, triggerType } = schedule;
  const lastTriggeredKey = `lastTriggered_${schedule.id}`;

  console.log("Retrieve last triggered date from storage");
  return new Promise((resolve) => {
    chrome.storage.sync.get(lastTriggeredKey, (data) => {
      const lastTriggered = new Date(data[lastTriggeredKey] || 0);

      console.log(
        "Check if current time is within the afterTime and beforeTime window"
      );
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const after = afterTime ? parseTime(afterTime) : 0;
      const before = beforeTime ? parseTime(beforeTime) : 1440;

      const withinTimeWindow = currentTime >= after && currentTime <= before;

      console.log("Determine if this should trigger based on type");
      let shouldOpen = false;

      if (
        triggerType === "Everytime on chrome open" ||
        now - lastTriggered >= 24 * 60 * 60 * 1000
      ) {
        switch (type) {
          case "Daily":
            shouldOpen = true;
            break;
          case "Weekly":
            shouldOpen = now - lastTriggered >= 7 * 24 * 60 * 60 * 1000;
            break;
          case "Monthly":
            shouldOpen = now.getMonth() !== lastTriggered.getMonth();
            break;
          case "Yearly":
            shouldOpen = now.getFullYear() !== lastTriggered.getFullYear();
            break;
        }
      }

      resolve(shouldOpen && withinTimeWindow);
    });
  });
};

console.log("Helper to parse HH:MM time strings to minutes since midnight");
const parseTime = (timeStr) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

console.log("Open URL if it meets the trigger conditions");
export const checkAndOpenUrl = async () => {
  const schedulers = await getSchedulers();
  const now = new Date();

  for (const schedule of schedulers) {
    if (await shouldTrigger(schedule)) {
      chrome.tabs.create({ url: schedule.url });

      console.log("Update last triggered time");
      const lastTriggeredKey = `lastTriggered_${schedule.id}`;
      chrome.storage.sync.set({ [lastTriggeredKey]: now.toISOString() });
    }
  }
};

console.log("Set interval to check every 5 seconds");
setInterval(() => {
  checkAndOpenUrl();
}, 5000);
