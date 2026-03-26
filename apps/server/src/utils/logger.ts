import pino from "pino";

const env = process.env.NODE_ENV ?? "development";
const isTest = env === "test";
const usePretty = env !== "production";

const logger = pino({
    level: process.env.LOG_LEVEL ?? (isTest ? "error" : "info"),
    transport: usePretty
        ? {
              target: "pino-pretty",
              options: {
                  colorize: true,
                  translateTime: "SYS:standard",
                  ignore: "pid,hostname",
                  singleLine: true,
              },
          }
        : undefined,
});

export default logger;
