/// <reference types="vitest" />
import { defineConfig } from "vite";

import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => ({
  plugins: [viteTsConfigPaths()],
  test: {
    globals: true,
  },
}));
