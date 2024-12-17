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
