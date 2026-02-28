import { getSchedulers, getPreferences } from "./utils.js";

// Cache preferences for synchronous access during critical events
let cachedPrefs = null;

const refreshPrefs = async () => {
  try {
    cachedPrefs = await getPreferences();
    console.log("Preferences cached:", cachedPrefs);
  } catch (e) {
    console.error("Failed to cache preferences:", e);
  }
};

// Initialize cache
refreshPrefs();

// Listen for storage changes to keep cache updated
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "local" && changes.preferences) {
    refreshPrefs();
  }
});

const logDebug = (message, data = null) => {
  const timestamp = new Date().toISOString();
  const logEntry = { timestamp, message, data };
  console.log("DEBUG LOG:", message, data);
  
  // Persist to storage for later inspection
  chrome.storage.local.get("debugLogs", (result) => {
    const logs = result.debugLogs || [];
    logs.push(logEntry);
    // Keep last 50 logs
    if (logs.length > 50) logs.shift();
    chrome.storage.local.set({ debugLogs: logs });
  });
};

// Listen for messages from the frontend
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "TEST_REMINDER") {
    logDebug("Test reminder requested");
    showCheckoutNotification(cachedPrefs || {}, true)
      .then(() => sendResponse({ success: true }))
      .catch((e) => sendResponse({ success: false, error: e.message }));
    return true; // Keep channel open for async response
  }
});

const showCheckoutNotification = async (prefs, isTest = false) => {
  const notificationId = isTest ? "test-checkout-reminder" : "checkout-reminder";
  
  if (!prefs.checkoutReminderEnabled && !isTest) {
    logDebug("Checkout reminder disabled, skipping.");
    return;
  }
  
  if (!prefs.checkoutUrl && !isTest) {
    logDebug("No checkout URL set, skipping.");
    return;
  }

  const message = isTest 
    ? `[TEST] ${prefs.reminderMessage || "Do you want to checkout?"}`
    : (prefs.reminderMessage || "Do you want to checkout?");

  return new Promise((resolve) => {
    chrome.notifications.create(notificationId, {
      type: "basic",
      iconUrl: "icons/icon48.png",
      title: isTest ? "Test Reminder" : "Closing Chrome",
      message: message,
      priority: 2,
      requireInteraction: true,
      buttons: [
        { title: prefs.confirmButtonText || "Checkout" },
        { title: prefs.dismissButtonText || "Dismiss" },
      ],
    }, (id) => {
      logDebug("Notification created", { id, isTest });
      resolve(id);
    });
  });
};

const checkShouldTrigger = (schedule, isOpen) => {
  const now = new Date();
  const { type, afterTime, beforeTime, triggerType, scheduledTime } = schedule;
  const lastTriggeredKey = `lastTriggered_${schedule.id}`;

  return new Promise((resolve) => {
    chrome.storage.local.get(lastTriggeredKey, (data) => {
      const lastTriggered = new Date(data[lastTriggeredKey] || 0);
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const after = afterTime ? parseTime(afterTime) : 0;
      const before = beforeTime ? parseTime(beforeTime) : 1440;

      const withinTimeWindow = currentTime >= after && currentTime <= before;

      let shouldOpen = false;

      if (triggerType === "On Scheduled time") {
        const targetTime = scheduledTime ? parseTime(scheduledTime) : 0;
        // Check if current time is within the same minute as target time
        const isAtScheduledTime = currentTime === targetTime;
        
        console.log(`Checking Schedule ${schedule.id}:`, {
          title: schedule.title,
          currentTime,
          targetTime,
          isAtScheduledTime,
          triggerType,
          lastTriggered: lastTriggered.toLocaleString()
        });

        // Allow trigger if it's the exact time OR if we just opened Chrome and missed the time (catch-up)
        // Only catch up if the scheduled time has passed today
        const isCatchUp = isOpen && currentTime > targetTime;

        if (isAtScheduledTime || isCatchUp) {
          switch (type) {
            case "Daily": {
              const ranToday = now.toDateString() === lastTriggered.toDateString();
              // If it ran today, only run again if the scheduled time is different (user changed it)
              if (ranToday) {
                 const lastTime = lastTriggered.getHours() * 60 + lastTriggered.getMinutes();
                 shouldOpen = lastTime !== targetTime;
                 console.log("Daily check:", { ranToday, lastTime, targetTime, shouldOpen });
              } else {
                 shouldOpen = true;
              }
              break;
            }
            case "Weekly":
              shouldOpen = now - lastTriggered >= 7 * 24 * 60 * 60 * 1000;
              break;
            case "Monthly":
              shouldOpen = 
                now.getMonth() !== lastTriggered.getMonth() ||
                now.getFullYear() !== lastTriggered.getFullYear();
              break;
            case "Yearly":
              shouldOpen = now.getFullYear() !== lastTriggered.getFullYear();
              break;
          }
        }
      } else if (
        (triggerType === "Everytime on chrome open" && isOpen) ||
        (triggerType === "Once per day" &&
          (now - lastTriggered >= 24 * 60 * 60 * 1000 || now.toDateString() !== lastTriggered.toDateString()))
      ) {
        // Added stricter 'Once per day' check to ensure daily reset works as expected
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

      resolve(
        shouldOpen &&
          (triggerType === "On Scheduled time" ? true : withinTimeWindow)
      );
    });
  });
};

const parseTime = (timeStr) => {
  if (!timeStr) return 0;
  
  const d = new Date(timeStr);
  if (!isNaN(d.getTime())) {
    return d.getHours() * 60 + d.getMinutes();
  }

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
  chrome.alarms.create("checkSchedulerAlarm", { periodInMinutes: 1 });
  checkAndOpenUrl(true);
});

chrome.alarms.onAlarm?.addListener((alarm) => {
  if (alarm.name === "checkSchedulerAlarm") {
    checkAndOpenUrl();
  }
});



chrome.windows?.onRemoved.addListener(async (windowId) => {
  try {
    // Use cached prefs if available, otherwise fetch
    const prefs = cachedPrefs || await getPreferences();
    
    // Check remaining windows
    const windows = await chrome.windows.getAll({
      populate: false,
      windowTypes: ["normal"],
    });
    
    logDebug("Window removed", { 
      closedWindowId: windowId, 
      remainingCount: windows.length, 
      prefsEnabled: prefs.checkoutReminderEnabled 
    });

    // If no normal windows remain
    if (windows.length === 0) {
      if (prefs.checkoutReminderEnabled && prefs.checkoutUrl) {
         await showCheckoutNotification(prefs, false);
      }
    }
  } catch (e) {
    logDebug("Error in windows.onRemoved", e.message);
  }
});

chrome.notifications?.onButtonClicked.addListener(
  async (notificationId, buttonIndex) => {
    if (notificationId !== "checkout-reminder" && notificationId !== "test-checkout-reminder") return;
    
    if (buttonIndex === 0) {
      const prefs = cachedPrefs || await getPreferences();
      if (prefs.checkoutUrl) {
        chrome.tabs.create({ url: prefs.checkoutUrl, active: true });
      }
    }
    chrome.notifications.clear(notificationId);
  }
);

chrome.notifications?.onClicked.addListener(async (notificationId) => {
  if (notificationId !== "checkout-reminder" && notificationId !== "test-checkout-reminder") return;
  
  const prefs = cachedPrefs || await getPreferences();
  if (prefs.checkoutUrl) {
    chrome.tabs.create({ url: prefs.checkoutUrl, active: true });
  }
  chrome.notifications.clear(notificationId);
});
