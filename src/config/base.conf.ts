import * as dotenv from "dotenv";
dotenv.config();

export const config = {
  baseUrl: process.env.BASE_URL || "https://the-internet.herokuapp.com",

  beforeSession: function () {
    // Global setup before each session
  },

  before: function () {
    // Global setup before all tests
  },
};
