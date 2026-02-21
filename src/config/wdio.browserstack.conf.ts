import type { Options } from "@wdio/types";
import { config as baseConfig } from "./base.conf";

/**
 * BrowserStack configuration for cross-browser / cross-device testing.
 * Used in CI pipeline for full regression runs.
 * Set BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY as secrets.
 */
export const config: Options.Testrunner = {
  ...baseConfig,

  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_ACCESS_KEY,

  specs: ["./tests/**/*.spec.ts"],

  maxInstances: 5,

  capabilities: [
    {
      browserName: "Chrome",
      browserVersion: "latest",
      "bstack:options": {
        os: "Windows",
        osVersion: "11",
        buildName: `proof-regression-${process.env.GITHUB_RUN_NUMBER || "local"}`,
        sessionName: "Chrome Latest - Windows 11",
        projectName: "Proof QA Automation",
      },
    },
    {
      browserName: "Firefox",
      browserVersion: "latest",
      "bstack:options": {
        os: "Windows",
        osVersion: "11",
        buildName: `proof-regression-${process.env.GITHUB_RUN_NUMBER || "local"}`,
        sessionName: "Firefox Latest - Windows 11",
        projectName: "Proof QA Automation",
      },
    },
    {
      browserName: "Safari",
      browserVersion: "17",
      "bstack:options": {
        os: "OS X",
        osVersion: "Sonoma",
        buildName: `proof-regression-${process.env.GITHUB_RUN_NUMBER || "local"}`,
        sessionName: "Safari 17 - macOS Sonoma",
        projectName: "Proof QA Automation",
      },
    },
  ],

  services: ["browserstack"],

  framework: "jasmine",
  reporters: [
    "spec",
    [
      "allure",
      {
        outputDir: "allure-results",
        disableWebdriverStepsReporting: false,
      },
    ],
  ],

  jasmineOpts: {
    defaultTimeoutInterval: 90000,
  },
};
