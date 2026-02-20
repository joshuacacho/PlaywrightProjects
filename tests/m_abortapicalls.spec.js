//We are trying to
//server is down error message due to API Requests being unable to be handled

//So image you have to test the scenario of where you place an API call but YOU NEVER WANT IT TO REACH THE BROWSER
    //timeout could fail with the api request as a server could be down and backend are unable to response back with an API Response

//In playwright there is a method called storage state and copy the ENTIRE tokens and cookie state and place it in a .json file
//Next time for each test case we run we can use the method storage state to inject all of the token and cookie state in each test above
//makes sense since now we will have ALL OF THE cookies and tokens associated with logging in so we dont have to guess

const { test, expect } = require("@playwright/test");

//global values
let webContext;

//Step 1 - log in and grab all of the information using the UI approach
//copy code from what we already did before
test.beforeAll(async ({ browser }) => {
  try {
    //this does not work as you CANT  define page above like browser is you have to define it like below
    //Error: "context" and "page" fixtures are not supported in "beforeAll" since they are created on a per-test basis.
    //If you would like to reuse a single page between tests, create context manually with browser.newContext(). See https://aka.ms/playwright/reuse-page for details.
    //If you would like to configure your page before each test, do that in beforeEach hook instead.

    //1. Open the browser instance
    //which browser are we opening? -> defined in the playwright.config.js file
    const context = await browser.newContext();
    //1a. Open new page
    //creates a new tab in the opened browser
    const page = await context.newPage();
    //1b. Navigate to the URL
    await page.goto("https://rahulshettyacademy.com/client/");
    await page.locator("#userEmail").fill("testUser63@example.com");
    await page.locator("#userPassword").fill("Test@1234");
    await page.locator("#login").click();
    await page.waitForLoadState("networkidle");

    //NEW CODE where we use playwright storage state method and store in file
    await context.storageState({ path: "state.json" });

    //Inject the state.json file in a new browser context with the existing storage data from above
    //now any new browser context has all the information it needs to act like a log in
    webContext = await browser.newContext({ storageState: "state.json" });
  } catch (error) {
    console.error(error.stack);
    throw error;
  }
});

test("Verify css files will NOT load on browser - visual inspecition", async () => {
  try {
    //creating a new page using the webContext from .beforeAll with ALL OF THE
    const page = await webContext.newPage();

    //block any value on the page which has CSS
    await page.route('**/*.css', route => route.abort());

    //navigate to the URL without using the log in credentials again
    const ordersURL ="https://rahulshettyacademy.com/client/#/dashboard/myorders";
    await goToURL(page, ordersURL);

    await page.pause();
   
  } catch (error) {
    console.error(error.stack);
  }
});


test.only("Verify css files will NOT load on browser - returning list of Network Calls", async () => {
  try {

    let failureReason = null;

    //creating a new page using the webContext from .beforeAll with ALL OF THE
    const page = await webContext.newPage();

    //block any value on the page which has CSS
    await page.route('**/*.css', route => route.abort());

    //output all network requests, responses and requestfailed (blocked ones that we abort)
    console.log("requests");
    await page.on('request', request => console.log("request", request.url())); //no response code will be seen next to it
    console.log("responses");
    await page.on('response', response => console.log("response",response.url(), response.status())); //response code & hello will be seen next to it
    console.log("failures");
    await page.on('requestfailed', request => {
         // request.failure() returns an object with an errorText property
        const error = request.failure();
        if (error && error.errorText === 'net::ERR_FAILED') {
            failureReason = error.errorText;
            console.log(`Specific failure detected: ${request.url()} - ${error.errorText}`);
        }
    })

     //navigate to the URL without using the log in credentials again
    const ordersURL ="https://rahulshettyacademy.com/client/#/dashboard/myorders";
    await goToURL(page, ordersURL);

    //will pass if .css is aborted and  await page.route('**/*.css', route => route.abort()); is NOT commented out
    expect(failureReason).toBe('net::ERR_FAILED');

    await page.pause();
   
  } catch (error) {
    console.error(error.stack);
  }
});

//go to any url via bypassing login above (MUST COME AFTER)
async function goToURL(page, url) {
  try {
    await page.goto(url);
  } catch (error) {
    console.error(`❌ Failed to navigate to URL: ${url}`);
    throw error;
  }
}

