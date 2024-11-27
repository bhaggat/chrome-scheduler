export const environment = import.meta.env.VITE_ENVIRONMENT;
export const isDebugMode = import.meta.env.VITE_DEBUG === "true";
export const isDev = environment === "development";
export const version = "1.0.1";

export const weeks = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

export const postNumber = {
  1: "st",
  2: "nd",
  2: "rd",
  3: "th",
  4: "th",
  5: "th",
};
