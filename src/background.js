import { getSchedulers, getPreferences } from "./utils.js";

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
  if (!timeStr) return 0;
  const timePart = timeStr.includes("T") ? timeStr.split("T")[1] : timeStr;
  const [hoursStr, minutesStr] = timePart.split(":");
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return 0;
  return hours * 60 + minutes;
};

export const openTab = (schedule) => {
  const { url, focusOnOpen, shouldPin } = schedule;
  chrome.tabs.query({}, (tabs) => {
    const existingTab = tabs.find((tab) => tab.url === url);
    if (existingTab) {
      chrome.tabs.update(existingTab.id, {
        active: !!focusOnOpen,
        pinned: !!shouldPin,
      });
      if (focusOnOpen) {
        chrome.windows.update(existingTab.windowId, { focused: true });
      }
    } else {
      chrome.tabs.create(
        { url, active: !!focusOnOpen, pinned: !!shouldPin },
        (tab) => {
          if (focusOnOpen && tab?.windowId) {
            chrome.windows.update(tab.windowId, { focused: true });
          }
        }
      );
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
        openTab(schedule);
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

const checkoutNotificationPrefix = "checkout-reminder::";

chrome.windows?.onRemoved.addListener(() => {
  try {
    chrome.windows.getAll({}, async (windows) => {
      if (windows.length === 0) {
        const prefs = await getPreferences();
        if (!prefs.checkoutReminderEnabled || !prefs.checkoutUrl) return;

        const notificationId =
          checkoutNotificationPrefix + encodeURIComponent(prefs.checkoutUrl);
        chrome.notifications.create(notificationId, {
          type: "basic",
          iconUrl: "icons/icon48.png",
          title: "Reminder",
          message: prefs.reminderMessage || "Do you want to checkout?",
          priority: 2,
          buttons: [
            { title: prefs.confirmButtonText || "Checkout" },
            { title: prefs.dismissButtonText || "Dismiss" },
          ],
        });
      }
    });
  } catch (e) {
    console.error("Error in windows.onRemoved", e);
  }
});

chrome.notifications?.onButtonClicked.addListener((notificationId, buttonIndex) => {
  if (!notificationId.startsWith(checkoutNotificationPrefix)) return;
  if (buttonIndex === 0) {
    const url = decodeURIComponent(
      notificationId.slice(checkoutNotificationPrefix.length)
    );
    chrome.tabs.create({ url, active: true });
  } else {
    chrome.notifications.clear(notificationId);
  }
});

chrome.notifications?.onClicked.addListener((notificationId) => {
  if (!notificationId.startsWith(checkoutNotificationPrefix)) return;
  const url = decodeURIComponent(
    notificationId.slice(checkoutNotificationPrefix.length)
  );
  chrome.tabs.create({ url, active: true });
  chrome.notifications.clear(notificationId);
});
