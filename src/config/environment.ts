import * as dotenv from "dotenv";
dotenv.config();

/**
 * EnvironmentConfig
 * Single source of truth for all environment-driven configuration.
 * Supports local, staging, and production environments.
 */

export type Environment = "local" | "staging" | "production";

interface Config {
  env: Environment;
  baseUrl: string;
  apiBaseUrl: string;
  credentials: {
    validUsername: string;
    validPassword: string;
  };
  timeouts: {
    implicit: number;
    pageLoad: number;
    script: number;
    element: number;
  };
  retries: number;
  headless: boolean;
}

function getEnv(): Environment {
  const env = process.env.TEST_ENV as Environment;
  return ["local", "staging", "production"].includes(env) ? env : "local";
}

const configs: Record<Environment, Config> = {
  local: {
    env: "local",
    baseUrl: "https://the-internet.herokuapp.com",
    apiBaseUrl: "https://httpbin.org",
    credentials: {
      validUsername: process.env.TEST_USERNAME || "tomsmith",
      validPassword: process.env.TEST_PASSWORD || "SuperSecretPassword!",
    },
    timeouts: { implicit: 0, pageLoad: 30000, script: 30000, element: 10000 },
    retries: 1,
    headless: true,
  },
  staging: {
    env: "staging",
    baseUrl: process.env.STAGING_URL || "https://the-internet.herokuapp.com",
    apiBaseUrl: process.env.STAGING_API_URL || "https://httpbin.org",
    credentials: {
      validUsername: process.env.TEST_USERNAME || "tomsmith",
      validPassword: process.env.TEST_PASSWORD || "SuperSecretPassword!",
    },
    timeouts: { implicit: 0, pageLoad: 45000, script: 45000, element: 15000 },
    retries: 2,
    headless: true,
  },
  production: {
    env: "production",
    baseUrl: process.env.PROD_URL || "https://the-internet.herokuapp.com",
    apiBaseUrl: process.env.PROD_API_URL || "https://httpbin.org",
    credentials: {
      validUsername: process.env.TEST_USERNAME || "",
      validPassword: process.env.TEST_PASSWORD || "",
    },
    timeouts: { implicit: 0, pageLoad: 60000, script: 60000, element: 20000 },
    retries: 3,
    headless: true,
  },
};

export const envConfig: Config = configs[getEnv()];
