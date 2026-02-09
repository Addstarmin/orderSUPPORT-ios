import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  preview: {
    host: true,
    port: 4173,

    // ✅ Cloudflare Tunnel / trycloudflare.com を許可
    allowedHosts: [
      "tour-barnes-hit-kent.trycloudflare.com",
      ".trycloudflare.com",
    ],
  },
});

