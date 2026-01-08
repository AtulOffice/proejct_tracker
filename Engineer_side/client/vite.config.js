import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  server: {
    host: true,
    port: 5174,
    allowedHosts: ["warlike-unlubricative-angelo.ngrok-free.dev", "localhost"],
  },
  plugins: [tailwindcss()],
});
