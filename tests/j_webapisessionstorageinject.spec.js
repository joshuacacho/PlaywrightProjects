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

test.only("Verify Dashboard Titles IPHONE 13 PRO Exists", async () => {

    //creatinga. new page using the webContext from .beforeAll with ALL OF THE 
    const page = await webContext.newPage();

    //navigate to the URL without using the log in credentials again
    const dashboardURL = "https://rahulshettyacademy.com/client/#/dashboard/dash";
    await goToURL(page, dashboardURL);

    //find order in list
    const cardTitles = await page.locator(".card-body h5").allTextContents();
    console.log(cardTitles);
    const iPhoneCardTitle = "iphone 13 pro"

    //assert title is correct
    expect(cardTitles).toContain(iPhoneCardTitle);

    await page.pause();
})

test("View Previous Order is already seen in the list", async () => {

    //creatinga. new page using the webContext from .beforeAll with ALL OF THE 
    const page = await webContext.newPage();

    //navigate to the URL without using the log in credentials again
    const ordersURL = "https://rahulshettyacademy.com/client/#/dashboard/myorders";
    await goToURL(page, ordersURL);

    //find order in list
    const finalOrderList = await returnOrderList(page);
    const previousOrderId = '6993a39e1fe6115f6a8b8864'


    //assert order number is in table
    expect(finalOrderList).toContain(previousOrderId);

    await page.pause();
})





// test.only("Place Order w/Utils folder for Optimization", async ({ page }) => {

//   try{ 

//     //grab token set above in .beforeAll login and use it here below when navigating to the URL
//     await injectTokenLogin(page);

//     //navigate to the URL
//     const ordersURL = "https://rahulshettyacademy.com/client/#/dashboard/myorders";
//     await goToURL(page, ordersURL);

//     //we need token and 
//     const finalOrderList = await returnOrderList(page);

//     //assert order number is in table
//     expect(finalOrderList).toContain(response.orderId);

//   } catch (error) {
//     console.error(error.stack);
//   }
// });


//inject login
async function injectTokenLogin(page) {
  try {
    //inject javascript expressions in local storage
      //The Playwright .addInitScript() API is a method used to inject JavaScript code into the browser environment that runs before a page's scripts and other resources are loaded
    await page.addInitScript((value) => {
      window.localStorage.setItem("token", value);
    }, response.token);
  } catch (error) {
    console.error(`❌ Failed to inject token to URL: ${response.token}`);
    console.error(error.stack);
    throw error;
  }
}

//go to any url via bypassing login above (MUST COME AFTER)
async function goToURL(page, url) {
  try {
    await page.goto(url);
  } catch (error) {
    console.error(`❌ Failed to navigate to URL: ${url}`);
    throw error;
  }
}

//find order in list
async function returnOrderList(page) {
  const yourOrderList = page.locator("th[scope='row']");

  //need to wiat for the values to be visible before grabbing them
  //A good rule of thumb is: If a method returns an Array immediately, you usually need to await a visibility check first.
  await expect(yourOrderList.first()).toBeVisible();

  const finalOrderList = await yourOrderList.allTextContents();
  console.log(finalOrderList);

  return finalOrderList;
}
