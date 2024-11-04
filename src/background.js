chrome.runtime?.onInstalled?.addListener?.(() => {
  console.log("Extension installed!! src 6");
});

export const getSchedulers = () =>
  new Promise((resolve) => {
    chrome.storage.sync.get("schedulers", (data) =>
      resolve(data.schedulers || [])
    );
  });

export const checkAndOpenUrl = async () => {
  const schedulers = await getSchedulers();
  console.log("schedulers", schedulers);
  const nextSchedule = schedulers.at(-1);
  console.log("nextSchedule", nextSchedule.url, nextSchedule);
  if (nextSchedule) chrome.tabs.create({ url: nextSchedule.url });
};

checkAndOpenUrl();

setInterval(() => {
  checkAndOpenUrl();
}, 5000);
