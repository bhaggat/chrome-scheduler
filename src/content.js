import pkg from "../package.json";
export const environment = import.meta.env.VITE_ENVIRONMENT;
export const isDebugMode = import.meta.env.VITE_DEBUG === "true";
export const isDev =
  environment === "development" || typeof chrome === "undefined" || !chrome.tabs;
export const version =
  typeof chrome !== "undefined" && chrome.runtime?.getManifest
    ? chrome.runtime.getManifest().version
    : pkg.version;
