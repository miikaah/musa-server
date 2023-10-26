import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ["./.jest/setEnvVars.js", "./.jest/setupFilesAfterEnv.js"],
  },
});
