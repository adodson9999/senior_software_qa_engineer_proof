const path = require("path");

// TS_NODE_TRANSPILE_ONLY=true and TS_NODE_SKIP_IGNORE=true set via npm scripts
// ensure all WDIO worker subprocesses inherit transpile-only mode,
// bypassing type-checking so Jasmine/WDIO globals don't cause TS errors.
require("ts-node").register({
  transpileOnly: true,
  skipIgnore: true,
  compilerOptions: {
    target: "ES2022",
    module: "commonjs",
    strict: false,
    esModuleInterop: true,
    skipLibCheck: true,
  },
});

require("dotenv").config();

const root = path.resolve(__dirname, "../../");

exports.config = {
  runner: "local",

  specs: [path.join(root, "tests/**/*.spec.ts")],

  exclude: [path.join(root, "tests/cross-browser.spec.ts")],

  suites: {
    smoke: [path.join(root, "tests/auth.spec.ts")],
    regression: [
      path.join(root, "tests/auth.spec.ts"),
      path.join(root, "tests/transactions.api.spec.ts"),
    ],
    e2e: [path.join(root, "tests/**/*.spec.ts")],
  },

  maxInstances: process.env.CI ? 2 : 4,

  capabilities: [
    {
      browserName: "chrome",
      "goog:chromeOptions": {
        args: [
          "--headless",
          "--disable-gpu",
          "--no-sandbox",
          "--disable-dev-shm-usage",
          "--window-size=1920,1080",
        ],
      },
    },
  ],

  baseUrl: process.env.BASE_URL || "https://the-internet.herokuapp.com",

  logLevel: "warn",
  bail: 0,
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  services: ["chromedriver"],

  framework: "jasmine",

  reporters: [
    "spec",
    [
      "allure",
      {
        outputDir: "allure-results",
        disableWebdriverStepsReporting: false,
        disableWebdriverScreenshotsReporting: false,
      },
    ],
  ],

  jasmineOpts: {
    defaultTimeoutInterval: 60000,
  },
};
