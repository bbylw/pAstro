import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://webnav-hub.example.com",
  server: {
    host: true,
    port: 4321,
  },
  devToolbar: {
    enabled: false,
  },
});