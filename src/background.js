// function sendNotification(title, message) {
//   console.log("send notification", { title, message });
//   chrome.notifications.create({
//     type: "basic",
//     title: title,
//     message: message,
//     iconUrl: "icons/icon48.png", // Your icon path here
//     priority: 2,
//   });
// }
export const getSchedulers = () =>
  new Promise((resolve, reject) => {
    chrome.storage.local.get("schedulers", (data) => {
      if (chrome.runtime.lastError) {
        console.error("Failed to get schedulers", chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
      } else {
        resolve(data.schedulers || []);
      }
    });
  });

export const saveSchedulers = (schedulers) => {
  chrome.storage.local.set({ schedulers }, () => {
    if (chrome.runtime.lastError) {
      console.error("Failed to save schedulers", chrome.runtime.lastError);
    }
  });
};

const checkShouldTrigger = (schedule, isOpen) => {
  const now = new Date();
  const { type, afterTime, beforeTime, triggerType } = schedule;
  const lastTriggeredKey = `lastTriggered_${schedule.id}`;

  return new Promise((resolve) => {
    chrome.storage.local.get(lastTriggeredKey, (data) => {
      const lastTriggered = new Date(data[lastTriggeredKey] || 0);
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const after = afterTime ? parseTime(afterTime) : 0;
      const before = beforeTime ? parseTime(beforeTime) : 1440;

      const withinTimeWindow = currentTime >= after && currentTime <= before;

      console.log("Determine if this should trigger based on type", {
        withinTimeWindow,
        after,
        before,
        currentTime,
        data,
        lastTriggeredKey,
        schedule,
      });
      let shouldOpen = false;

      if (
        (triggerType === "Everytime on chrome open" && isOpen) ||
        (triggerType === "Once per day" &&
          now - lastTriggered >= 24 * 60 * 60 * 1000)
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

const parseTime = (timeStr) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

export const openTab = (url) => {
  chrome.tabs.query({}, (tabs) => {
    const existingTab = tabs.find((tab) => tab.url === url);
    if (existingTab) {
      chrome.tabs.update(existingTab.id, { active: true });
    } else {
      chrome.tabs.create({ url });
    }
  });
};

export const checkAndOpenUrl = async (isOpen = false) => {
  try {
    const schedulers = await getSchedulers();
    const now = new Date();

    for (const schedule of schedulers) {
      const shouldTrigger = await checkShouldTrigger(schedule, isOpen);
      if (shouldTrigger) {
        openTab(schedule.url);
        const lastTriggeredKey = `lastTriggered_${schedule.id}`;
        chrome.storage.local.set({ [lastTriggeredKey]: now.toISOString() });
      }
    }
  } catch (error) {
    console.error("Error in checkAndOpenUrl:", error);
  }
};
chrome.runtime.onInstalled?.addListener(() => {
  console.log("Extension installed!", new Date().toISOString());
  chrome.alarms.clearAll();
  chrome.alarms.create("checkSchedulerAlarm", { periodInMinutes: 1 });
});

console.log("chrome.runtime", new Date().toISOString(), chrome.runtime);
chrome.runtime.onStartup?.addListener(() => {
  console.log("Extension has been launched (Chrome started) or reloaded.");
  chrome.alarms.clearAll();
  checkAndOpenUrl(true);
});

chrome.alarms.onAlarm?.addListener((alarm) => {
  console.log("onAlarm", alarm.name, { alarm });
  if (alarm.name === "checkSchedulerAlarm") {
    checkAndOpenUrl();
  }
});
