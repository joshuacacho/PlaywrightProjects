// @ts-check
import { defineConfig, devices } from '@playwright/test';
import { report } from 'node:process';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
//javascript object with key value pairs
const config = ({
  testDir: './tests',
  //override timeouts
  timeout: 45 * 1000, //45 seconds
  //assertion timeout
  expect: {
    timeout: 10000 //10 seconds
  },
  //number of times to retry a failed test, can be set to a specific number or to 0 to disable retries, this can be useful for handling flaky tests and improving test stability by allowing them to be retried a certain number of times before being marked as failed.
  retries: 5, 
  //add reporter in html
  reporter: 'html',
  use: {
    //browser options
    browserName: 'chromium',
      //webkit - Safari
      //chromium - chrome
      //firefox - firefox

    //setting headless to false to see the browser action
    headless: false,

    //set screenshot on or off
      // 'off': Disable automatic screenshots (default).
      // 'on': Capture for every test.
      // 'only-on-failure': Capture only when a test fails.
      // 'on-first-retry': Capture only when retrying a failed test.
    screenshot: 'only-on-failure',

    //set trace on or off
      // 'off': No trace is recorded.
      // 'on': A trace is recorded for every test (performance heavy).
      // 'on-first-retry': Recommended for CI; records a trace only during the first retry of a failed test.
      // 'on-all-retries': Records a trace for every retry attempt.
      // 'retain-on-failure': Records a trace for every test but deletes it if the test passes, keeping only failure data.
      // 'retain-on-first-failure': Similar to retain-on-failure but specifically for the first attempt.
    trace: 'on', //only on failure basically
  }
});

//Export the above config object
module.exports = config;

  // /* Run tests in files in parallel */
  // fullyParallel: true,
  // /* Fail the build on CI if you accidentally left test.only in the source code. */
  // forbidOnly: !!process.env.CI,
  // /* Retry on CI only */
  // retries: process.env.CI ? 2 : 0,
  // /* Opt out of parallel tests on CI. */
  // workers: process.env.CI ? 1 : undefined,
  // /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  // reporter: 'html',
  // /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  // use: {
  //   /* Base URL to use in actions like `await page.goto('')`. */
  //   // baseURL: 'http://localhost:3000',

  //   /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
  //   trace: 'on-first-retry',
  // },

  // /* Configure projects for major browsers */
  // projects: [
  //   {
  //     name: 'chromium',
  //     use: { ...devices['Desktop Chrome'] },
  //   },

  //   {
  //     name: 'firefox',
  //     use: { ...devices['Desktop Firefox'] },
  //   },

  //   {
  //     name: 'webkit',
  //     use: { ...devices['Desktop Safari'] },
  //   },

  //   /* Test against mobile viewports. */
  //   // {
  //   //   name: 'Mobile Chrome',
  //   //   use: { ...devices['Pixel 5'] },
  //   // },
  //   // {
  //   //   name: 'Mobile Safari',
  //   //   use: { ...devices['iPhone 12'] },
  //   // },

  //   /* Test against branded browsers. */
  //   // {
  //   //   name: 'Microsoft Edge',
  //   //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
  //   // },
  //   // {
  //   //   name: 'Google Chrome',
  //   //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
  //   // },
  // ],

  // /* Run your local dev server before starting the tests */
  // // webServer: {
  // //   command: 'npm run start',
  // //   url: 'http://localhost:3000',
  // //   reuseExistingServer: !process.env.CI,
  // // },
// });

