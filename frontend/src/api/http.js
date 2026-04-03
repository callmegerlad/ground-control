import axios from "axios";

function buildApiBaseUrl() {
  const configured = import.meta.env.VITE_API_BASE_URL;

  if (configured && configured.trim().length > 0) {
    const cleaned = configured.trim().replace(/\/+$/, "");
    return cleaned.endsWith("/api/v1") ? cleaned : `${cleaned}/api/v1`;
  }

  const host =
    typeof window !== "undefined" ? window.location.hostname : "localhost";

  if (host === "localhost" || host === "127.0.0.1") {
    return `http://${host}:8000/api/v1`;
  }

  throw new Error(
    "VITE_API_BASE_URL is required in non-local environments and must use HTTPS.",
  );
}

const apiBaseUrl = buildApiBaseUrl();

export const http = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10_000,
});
