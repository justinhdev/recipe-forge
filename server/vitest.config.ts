import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["./src/test/test-env.ts", "./src/test/setup.ts"],
    include: ["./src/test/**/*.test.ts"],
    globals: true,
    restoreMocks: true,
    fileParallelism: false,
  },
});
