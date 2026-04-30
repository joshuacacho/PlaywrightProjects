const { Before, After, BeforeStep, AfterStep, Status } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');
const fs = require('fs');

//BEFORE any test runs, the Before hook will execute and set up the browser, context, and page objects. This allows us to have a clean browser instance for each scenario. 
Before( {tags: "@webTestser or @webTests"}, async function () {
    console.log("I am executing before ALL SCENARIOS before they have started, Before hook");
    this.browser = await chromium.launch({ headless: false });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
});

//AFTER all test runs, the After hook will run after each scenario and will close the page and browser to ensure that we don't have any leftover instances consuming resources..
After(async function () {
    console.log("I am executing after ALL SCENARIOS after they have ended, After hook");
    await this.page.close();
    await this.browser.close();
});


//BeforeStep and AfterStep hooks are used to execute code before and after each step in a scenario. In this example, 

//BeforeStep - the BeforeStep hook is set to execute only for scenarios tagged with @foo
BeforeStep(function () {
  // This hook will be executed before all steps in a scenario with tag @foo
  console.log("I am executing before each step in the scenario, BeforeStep hook");
});

//AfterStep - the AfterStep hook will execute after every step and take a screenshot if the step fails.
AfterStep( async function ({result}) {
    console.log("I am executing after each step in the scenario, AfterStep hook");
  // This hook will be executed after all steps, and take a screenshot on step failure
  if (result.status === Status.FAILED) {
        if (!fs.existsSync('features/screenshots')) {
            fs.mkdirSync('features/screenshots', { recursive: true });
        }
        await this.page.screenshot({ path: `features/screenshots/screenshot-${Date.now()}.png` });
    }
});