export const environment = import.meta.env.VITE_ENVIRONMENT;
export const isDebugMode = import.meta.env.VITE_DEBUG === "true";
export const isDev = environment === "development";
export const version = "1.0.1";
