import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },

    test: {
        globals: true,
        environment: "node",
        setupFiles: ["src/tests/setup.ts"],
        coverage: {
            provider: "v8",
            reporter: ["text", "html"],
            reportsDirectory: "./coverage",
            exclude: [
                "node_modules/",
                "dist/*",
                "src/generated/",
                "**/*.d.ts",
                "**/*.config.*",
            ],
        },
        projects: [
            {
                extends: true,
                test: {
                    name: "unit",
                    include: ["**/*.unit.test.ts"],
                },
            },
            {
                extends: true,
                test: {
                    name: "integration",
                    include: ["**/*.int.test.ts"],
                },
            },
        ],
    },
});
