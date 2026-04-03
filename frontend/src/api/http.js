import axios from "axios";

function isLocalHostname(hostname) {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

function normalizeConfiguredApiBaseUrl(configured) {
  const cleaned = configured.trim().replace(/\/+$/, "");
  const withApiPrefix = cleaned.endsWith("/api/v1") ? cleaned : `${cleaned}/api/v1`;

  if (typeof window === "undefined") {
    return withApiPrefix;
  }

  if (window.location.protocol !== "https:" || !withApiPrefix.startsWith("http://")) {
    return withApiPrefix;
  }

  try {
    const parsedUrl = new URL(withApiPrefix);
    if (!isLocalHostname(parsedUrl.hostname)) {
      parsedUrl.protocol = "https:";
      return parsedUrl.toString().replace(/\/+$/, "");
    }
  } catch {
    return withApiPrefix;
  }

  return withApiPrefix;
}

function buildApiBaseUrl() {
  const configured = import.meta.env.VITE_API_BASE_URL;

  if (configured && configured.trim().length > 0) {
    return normalizeConfiguredApiBaseUrl(configured);
  }

  const host =
    typeof window !== "undefined" ? window.location.hostname : "localhost";

  if (isLocalHostname(host)) {
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
