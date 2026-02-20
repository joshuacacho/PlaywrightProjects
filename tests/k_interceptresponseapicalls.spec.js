//We are trying to 
    //log in
    //test add to cart
    //test order
    //test oreder details
    //test order history

//So imagine you see that in order to perform the API tests directly like we did in test filed i_XXXX.spec.js you find yourself having to 
    //set a lot of cookies
    //set a lot of tokens

//In playwright there is a method called storage state and copy the ENTIRE tokens and cookie state and place it in a .json file
    //Next time for each test case we run we can use the method storage state to inject all of the token and cookie state in each test above
        //makes sense since now we will have ALL OF THE cookies and tokens associated with logging in so we dont have to guess 




const { test, expect, request } = require("@playwright/test");
//import { test, expect, request } from '@playwright/test';
//import { APIUtilities } from './utils/APIUtilities.cjs';
const { APIUtilities } = require('./utils/APIUtilities');

//global values
let webContext;


//Step 1 - log in and grab all of the information using the UI approach
    //copy code from what we already did before
test.beforeAll( async ({browser}) => {
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
        await page.goto("https://rahulshettyacademy.com/client/")
        await page.locator("#userEmail").fill("testUser63@example.com");
        await page.locator("#userPassword").fill("Test@1234");
        await page.locator("#login").click();
        await page.waitForLoadState("networkidle");

        //NEW CODE where we use playwright storage state method and store in file
        await context.storageState({ path: 'state.json'});

        //Inject the state.json file in a new browser context with the existing storage data from above
            //now any new browser context has all the information it needs to act like a log in
        webContext = await browser.newContext({storageState: 'state.json'});
        
   
    } catch (error) {
        console.error(error.stack);
        throw error;
    }
});


test.only("View No Previous Order Message BY INJECTION", async ({request}) => {

    try {
        //creatinga. new page using the webContext from .beforeAll with ALL OF THE 
        const page = await webContext.newPage();

        //navigate to the URL without using the log in credentials again
        const dashboardURL = "https://rahulshettyacademy.com/client/#/dashboard/dash";
        await goToURL(page, dashboardURL);

        //Verify there are no orders on the page
            //this is the api call that is giving us the orders and YOU HAVE TO CALL THIS FIRST SO PLAYWRIGHT KNOWS WHAT TO INjECT
            //WHEN IT REACHES THE ACTUAL ORDERS PAGE, that is why we went to Dashboard above, did the hijacking of the response and
            //ONLY THEN clicked on the my orders below
                //https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/6983d5dfc941646b7ad54f39
                //however because the /6983d5dfc941646b7ad54f39 is associated with a user we want to ensure our test works for all 
                    //and every user so we put /** OR /* at the end of the url so it will take into acccount ANY USER
        const ordersByUserURL = "https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/**"

        await page.route(ordersByUserURL, async route => {
        //intercepting repsonse
            //api gives back response and we will send it to browser so the front end will reflect the message with no orders is seen
                //intercepting api response -> playwright fake response -> browser -> render data to UI
        //caught the repsponse
        const response = await page.request.fetch(route.request());
        //override normal body that is returned WITH ORDERS agains the our response with no orders
            //you need to stringify the object into JSON as that is how the response is returned
            //without the JSON.stringify it is a Javascript Object and NOT a JSON returned object
        let body = JSON.stringify({data: [], message: "No Orders"});
        //give response to browser to render to UI
        route.fulfill( {
            //take response and inject the body that triggers the UI to return the UI message with no orders
            response,
            body
        });
    });

        //click on my orders
        await page.getByRole('button' , { name: '   ORDERS' }).click();

        //Playwright's page.waitForResponse() method is used to pause a test until a specific network response is received, allowing you to validate data or synchronize actions that depend on backend API calls. 
        await page.waitForResponse(ordersByUserURL);

        //now we can verify the message appears 
        const noOrdersMessage = await page.locator(".mt-4").textContent();
        console.log(noOrdersMessage); 

        //now we can assert the message
        expect(noOrdersMessage).toContain("You have No Orders to show at this time. Please Visit Back Us");

    } catch (error) {
        console.error(error.stack)
    }

    
})


//go to any url via bypassing login above (MUST COME AFTER)
async function goToURL(page, url) {
  try {
    await page.goto(url);
  } catch (error) {
    console.error(`❌ Failed to navigate to URL: ${url}`);
    throw error;
  }
}
