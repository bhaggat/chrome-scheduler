const isExtension = typeof chrome !== "undefined" && chrome.storage && chrome.storage.local;

export const getSchedulers = () =>
  new Promise((resolve, reject) => {
    if (!isExtension) {
      const data = localStorage.getItem("schedulers");
      resolve(data ? JSON.parse(data) : []);
      return;
    }
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
  if (!isExtension) {
    localStorage.setItem("schedulers", JSON.stringify(schedulers));
    return;
  }
  chrome.storage.local.set({ schedulers }, () => {
    if (chrome.runtime.lastError) {
      console.error("Failed to save schedulers", chrome.runtime.lastError);
    }
  });
};

const defaultPreferences = {
  checkoutReminderEnabled: false,
  checkoutUrl: "",
  reminderMessage: "Do you want to checkout before closing Chrome?",
  confirmButtonText: "Checkout",
  dismissButtonText: "Dismiss",
};

export const getPreferences = () =>
  new Promise((resolve, reject) => {
    if (!isExtension) {
      const data = localStorage.getItem("preferences");
      resolve({
        ...defaultPreferences,
        ...(data ? JSON.parse(data) : {}),
      });
      return;
    }
    chrome.storage.local.get("preferences", (data) => {
      if (chrome.runtime.lastError) {
        console.error("Failed to get preferences", chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
      } else {
        resolve({ ...defaultPreferences, ...(data.preferences || {}) });
      }
    });
  });

export const savePreferences = (preferences) => {
  if (!isExtension) {
    localStorage.setItem("preferences", JSON.stringify(preferences));
    return;
  }
  chrome.storage.local.set({ preferences }, () => {
    if (chrome.runtime.lastError) {
      console.error("Failed to save preferences", chrome.runtime.lastError);
    }
  });
};

export const getFormDefaults = () =>
  new Promise((resolve, reject) => {
    if (!isExtension) {
      const data = localStorage.getItem("formDefaults");
      resolve(data ? JSON.parse(data) : {});
      return;
    }
    chrome.storage.local.get("formDefaults", (data) => {
      if (chrome.runtime.lastError) {
        console.error("Failed to get form defaults", chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
      } else {
        resolve(data.formDefaults || {});
      }
    });
  });

export const saveFormDefaults = (defaults) => {
  if (!isExtension) {
    localStorage.setItem("formDefaults", JSON.stringify(defaults));
    return;
  }
  chrome.storage.local.set({ formDefaults: defaults }, () => {
    if (chrome.runtime.lastError) {
      console.error("Failed to save form defaults", chrome.runtime.lastError);
    }
  });
};
