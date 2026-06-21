import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://pastro.ndjp.net",
  base: "",
  server: {
    host: true,
    port: 4321,
  },
  devToolbar: {
    enabled: false,
  },
});