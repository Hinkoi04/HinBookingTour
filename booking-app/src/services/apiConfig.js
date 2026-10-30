const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

if (!apiBaseUrl) {
  throw new Error("Missing VITE_API_BASE_URL. Configure it in the frontend environment.");
}

export const API_BASE_URL = apiBaseUrl.replace(/\/+$/, "");
export const BOOKING_STATUS_SYNC_URL =
  import.meta.env.VITE_BOOKING_STATUS_SYNC_URL?.trim() || "";
