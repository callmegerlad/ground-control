import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const envAllowedHosts = (
  process.env.VITE_ALLOWED_HOSTS ??
  process.env.ALLOWED_HOSTS ??
  ""
)
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean);

const allowedHosts = envAllowedHosts;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts,
    watch: {
      usePolling: true,
    },
    host: true,
    strictPort: true,
    hmr: {
      clientPort: 5173,
    },
  },
});
