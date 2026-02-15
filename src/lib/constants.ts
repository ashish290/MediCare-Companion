export const APP_NAME = "MediCare Companion";

export const DEFAULT_NOTIFICATION_TIME = "21:00";

export const LOADING_DELAY_MS = 200;

export const STALE_TIME = {
  MEDICATIONS: 1000 * 60 * 2,
  LOGS: 1000 * 60 * 1,
  PROFILE: 1000 * 60 * 5,
} as const;

export const QUERY_KEYS = {
  MEDICATIONS: ["medications"] as const,
  TODAY_LOGS: ["medication-logs", "today"] as const,
  MEDICATIONS_WITH_STATUS: ["medications-with-status"] as const,
  PROFILE: ["profile"] as const,
} as const;
