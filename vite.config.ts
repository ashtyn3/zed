import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { esbuildCommonjs } from "@originjs/vite-plugin-commonjs";

// https://vitejs.dev/config/
export default defineConfig({
    optimizeDeps: {
        exclude: ["isolated-vm/"],
    },
    plugins: [react()],
});
