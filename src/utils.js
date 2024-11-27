import { postNumber, weeks } from "./content";
import customDayjs from "./customDayjs";

export const getSchedulers = () =>
  new Promise((resolve, reject) => {
    chrome.storage?.sync?.get("schedulers", (data) => {
      if (chrome.runtime.lastError) {
        console.error("Failed to get schedulers", chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
      } else {
        resolve(data.schedulers || []);
      }
    });
  });

export const saveSchedulers = (schedulers) => {
  chrome.storage?.sync?.set({ schedulers }, () => {
    if (chrome.runtime.lastError) {
      console.error("Failed to save schedulers", chrome.runtime.lastError);
    }
  });
};

export const getLabel = (date, repeatType) => {
  if (!customDayjs.isDayjs(date)) {
    date = customDayjs(date);
  }
  switch (repeatType) {
    case "Weekly":
      return `Weekly ${weeks[date.day()]}`;
    case "Monthly":
      return `Monthly On ${date.date()}`;
    case "Yearly":
      return `Yearly On ${date.format("MMMM D")}`;
    default: {
      if (repeatType.includes(":custom")) {
        const [weekType, dayType] = repeatType?.split(":");
        const weekOfMonth = parseInt(weekType?.split("-")[1]);
        const dayOfWeek = parseInt(dayType?.split("-")[1]);
        return `Monthly On ${weekOfMonth}${postNumber[weekOfMonth]} ${weeks[dayOfWeek]}`;
      } else {
        return `${repeatType}`;
      }
    }
  }
};

const lastTriggered = {
  1731561504593: "2024-11-14T14:07:40+05:30",
  17315615045931: "2024-11-14T11:00:00+05:30",
  17315615045966: "2024-11-14T11:00:00+05:30",
};
const defaultDataList = [
  // {
  //   id: "1731561178481",
  //   title: "Webosmotic",
  //   url: "https://www.webosmotic.com",
  //   afterTime: "10:53",
  //   beforeTime: "00:53",
  //   type: "week-3:day-4:custom",
  //   triggerType: "Everytime on chrome open",
  //   shouldPin: false,
  //   date: "2024-11-14",
  // },
  {
    id: "1731561504593",
    title: "Webosmotic",
    url: "https://www.webosmotic.com",
    afterTime: "16:54",
    beforeTime: "16:56",
    type: "Monthly",
    triggerType: "Everytime on chrome open",
    shouldPin: true,
    date: "2024-12-13",
  },
  {
    id: "17315615045931",
    title: "Webosmotic",
    url: "https://www.webosmotic.com",
    afterTime: "15:03",
    beforeTime: "16:55",
    type: "Monthly",
    triggerType: "Everytime on chrome open",
    shouldPin: true,
    date: "2024-11-13",
  },
  {
    id: "17315615045966",
    title: "Webosmotic",
    url: "https://www.webosmotic.com",
    afterTime: "11:05",
    beforeTime: "15:56",
    type: "Monthly",
    triggerType: "Everytime on chrome open",
    shouldPin: true,
    date: "2024-10-24",
  },
  // {
  //   id: "1731561768624",
  //   title: "Webosmotic",
  //   url: "https://www.webosmotic.com",
  //   afterTime: "00:54",
  //   beforeTime: "22:54",
  //   type: "Weekly",
  //   triggerType: "Everytime on chrome open",
  //   shouldPin: true,
  //   date: "2024-11-14",
  // },
  // {
  //   id: "1731561775416",
  //   title: "Webosmotic",
  //   url: "https://www.webosmotic.com",
  //   afterTime: "",
  //   beforeTime: "",
  //   type: "Yearly",
  //   triggerType: "Everytime on chrome open",
  //   shouldPin: false,
  //   date: "2024-11-14",
  // },
  // {
  //   id: "1731561784032",
  //   title: "Webosmotic",
  //   url: "https://www.webosmotic.com",
  //   afterTime: "",
  //   beforeTime: "",
  //   type: "Monthly",
  //   triggerType: "Everytime on chrome open",
  //   shouldPin: false,
  //   date: "2024-10-31",
  // },
];

export const getNextTriggers = () => {
  const triggers = [];
  let lowestNextTriggerTime;
  const addByEligibility = (nextPossibleTriggerDate, trigger) => {
    console.log("nextPossibleTriggerDate, trigger", {
      lowestNextTriggerTime: lowestNextTriggerTime?.format?.(),
      nextPossibleTriggerDate: nextPossibleTriggerDate?.format?.(),
      trigger,
    });
    if (
      !lowestNextTriggerTime ||
      (lowestNextTriggerTime &&
        (lowestNextTriggerTime?.format?.() ===
          nextPossibleTriggerDate?.format?.() ||
          lowestNextTriggerTime.isAfter(nextPossibleTriggerDate)))
    ) {
      if (
        lowestNextTriggerTime &&
        lowestNextTriggerTime.isAfter(nextPossibleTriggerDate)
      ) {
        triggers.length = 0;
      }
      lowestNextTriggerTime = nextPossibleTriggerDate;
      triggers.push({
        nextTriggerTime: lowestNextTriggerTime.format(),
        ...trigger,
      });
    }
  };
  defaultDataList.forEach((trigger) => {
    console.log("startttt**********");
    const { id, afterTime, beforeTime, type, date } = trigger;
    const currentTime = customDayjs();
    const startDateTime = customDayjs(
      customDayjs(
        `${customDayjs(date).format("YYYY-MM-DD")} ${afterTime ?? "00:00:00"}`
      )
    );
    const todayTriggerStartTime = customDayjs(
      customDayjs(
        `${customDayjs().format("YYYY-MM-DD")} ${afterTime ?? "00:00:00"}`
      )
    );
    const todayTriggerEndTime = customDayjs(
      customDayjs(
        `${customDayjs().format("YYYY-MM-DD")} ${beforeTime ?? "23:59:59"}`
      )
    );
    const lastTriggeredDate = lastTriggered?.[id]
      ? customDayjs(lastTriggered[id])
      : "";
    let nextPossibleTriggerDate = startDateTime;
    if (startDateTime.isBefore(todayTriggerStartTime)) {
      nextPossibleTriggerDate = todayTriggerStartTime;
    }
    if (nextPossibleTriggerDate.isBefore(currentTime)) {
      nextPossibleTriggerDate = currentTime;
    }
    if (type === "Do Not Repeat") {
      if (startDateTime.isAfter(currentTime)) {
        nextPossibleTriggerDate = startDateTime;
        if (lastTriggeredDate?.isSame?.(nextPossibleTriggerDate, "day")) {
          nextPossibleTriggerDate = "";
        }
      } else {
        nextPossibleTriggerDate = "";
      }
    } else if (type === "Daily") {
      if (lastTriggeredDate?.isSame?.(nextPossibleTriggerDate, "day")) {
        nextPossibleTriggerDate = todayTriggerStartTime.add(1, "day");
      } else {
        if (nextPossibleTriggerDate.isAfter(todayTriggerEndTime)) {
          nextPossibleTriggerDate = todayTriggerStartTime.add(1, "day");
        }
      }
    } else if (type === "Weekly") {
      const dayOfThatWeek = startDateTime.day();
      const nThdayInWeek = customDayjs()
        .startOf("week")
        .add(dayOfThatWeek, "day");
      const thisWeekWithStartAfter = customDayjs(
        customDayjs(
          `${nThdayInWeek.format("YYYY-MM-DD")} ${afterTime ?? "00:00:00"}`
        )
      );
      nextPossibleTriggerDate = thisWeekWithStartAfter;
      if (startDateTime.isAfter(currentTime)) {
        nextPossibleTriggerDate = startDateTime;
      } else {
        if (lastTriggeredDate?.isSame?.(nextPossibleTriggerDate, "week")) {
          nextPossibleTriggerDate = thisWeekWithStartAfter.add(1, "week");
        } else {
          if (nextPossibleTriggerDate.isAfter(todayTriggerEndTime)) {
            nextPossibleTriggerDate = todayTriggerStartTime.add(1, "week");
          }
          if (nextPossibleTriggerDate.isBefore(currentTime)) {
            nextPossibleTriggerDate = currentTime;
          }
        }
      }
    } else if (type === "Monthly") {
      const dateOfThatMonth = startDateTime.date();
      const nThdayInMonth = customDayjs()
        .startOf("month")
        .add(dateOfThatMonth - 1, "day");
      const thisMonthWithStartAfter = customDayjs(
        customDayjs(
          `${nThdayInMonth.format("YYYY-MM-DD")} ${afterTime ?? "00:00:00"}`
        )
      );
      nextPossibleTriggerDate = thisMonthWithStartAfter;
      if (startDateTime.isAfter(currentTime)) {
        nextPossibleTriggerDate = startDateTime;
      } else {
        if (lastTriggeredDate?.isSame?.(nextPossibleTriggerDate, "month")) {
          nextPossibleTriggerDate = thisMonthWithStartAfter.add(1, "month");
        } else {
          if (
            nextPossibleTriggerDate.isSame(todayTriggerEndTime, "day") &&
            nextPossibleTriggerDate.isAfter(todayTriggerEndTime)
          ) {
            nextPossibleTriggerDate = todayTriggerStartTime.add(1, "month");
          }
          if (nextPossibleTriggerDate.isBefore(currentTime)) {
            nextPossibleTriggerDate = currentTime;
          }
        }
      }
    }
    if (nextPossibleTriggerDate) {
      addByEligibility(nextPossibleTriggerDate, trigger);
    }
  });
  console.log("triggers finalll", triggers[0].nextTriggerTime, triggers);
  return triggers;
};
getNextTriggers();
