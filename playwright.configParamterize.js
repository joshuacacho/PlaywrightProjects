// @ts-check
import { defineConfig, devices } from '@playwright/test';
import { permission, report } from 'node:process';

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
 timeout: 15 * 1000, //15 seconds
 //assertion timeout
 expect: {
   timeout: 10000 //10 seconds
 },


 //add projects for major browsers
 projects: [
   {
     //0 index chrome browser execution and uses the below test options
     name: 'projChromeBrowser',
     use: {
       //browser options
       browserName: 'chromium',
       //setting headless to false to see the browser action
       headless: false,
       //set screenshot on or off
       screenshot: 'on',
       //set trace on or off
       trace: 'on',
       //change size of screen
        //can be useful for tablet, mobile, and other viewports for mobile responsive testing ensuring elements are visible and interactable
       viewport: { width: 480, height: 480 },
        //slow down execution by ms value to see the action more clearly
        //slowMo: 1000
     }
   },
   {
     //1 index safari browser execution and uses the below test options
     name: 'projSafariBrowser',
     use: {
       //browser options
       browserName: 'webkit',
       //setting headless to false to see the browser action
       headless: false,
       //set screenshot on or off
       screenshot: 'only-on-failure',
       //set trace on or off
       trace: 'off',
       //for macOS and event Google we can set the iPhone Model we want using 
        //...devices and then the specific device we want to use
        //can be useful for tablet, mobile, and other viewports for mobile responsive testing ensuring elements are visible and interactable
       ...devices["iPhone 11 Pro Max"],
       ...devices[""]
       
     }
   },
   {
     //2 index https browser execution and uses the below test options
     name: 'projHttpsBrowsers',
     use: {
       //browser options
       browserName: 'chromium',
       //setting headless to false to see the browser action
       headless: false,
       //set screenshot on or off
       screenshot: 'only-on-failure',
       //set trace on or off
       trace: 'off',
       ignoreHTTPSErrors: true, //ignores any https errors that may come up during execution,
       
     }
   },
   {
     //3 index permission on a page
      //such as when google asks you for permission to access your location, camera, or microphone, you can use the permissions option in the config file to handle these permission popups and allow or deny them as needed for your tests.
     name: 'projGeolocationPermission',
     use: {
       //browser options
       browserName: 'chromium',
       //setting headless to false to see the browser action
       headless: false,
       //set screenshot on or off
       screenshot: 'only-on-failure',
       //set trace on or off
       trace: 'off',
       //permissions to allow during the test, can be set to other permissions such as 'camera', 'microphone', etc. depending on the needs of the test  
        //here we are bypassing geolocation permission popup and allowing it to access the location for the test to continue without interruption
       permissions: ['geolocation'], 
     }
   },
   {
     //3 index permission on a page
      //such as when google asks you for permission to access your location, camera, or microphone, you can use the permissions option in the config file to handle these permission popups and allow or deny them as needed for your tests.
     name: 'projRecVideo',
     use: {
       //browser options
       browserName: 'chromium',
       //setting headless to false to see the browser action
       headless: false,
       //set screenshot on or off
       screenshot: 'only-on-failure',
       //set trace on or off
       trace: 'on',
       //record video only on the first retry of a failed test, which can be useful for debugging and analyzing test failures without incurring the overhead of recording videos for every test run. This setting helps to optimize storage and performance while still providing valuable insights when tests fail.
       video: 'on', 
     }
   }
 ],
 //add reporter in html
 reporter: 'html',
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
