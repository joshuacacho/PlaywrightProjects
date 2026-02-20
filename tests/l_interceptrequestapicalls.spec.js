//We are trying to
//intercept request and ensure the below scenario

//So image you have to test the scenario of
//“Please check whether you are getting unauthorized forbidden error when you try to access some other order in your own account which does not belong to you”

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

test.only("Verify only User Logged In Can Only View their Own User", async () => {
  try {
    //creatinga. new page using the webContext from .beforeAll with ALL OF THE
    const page = await webContext.newPage();

    //navigate to the URL without using the log in credentials again
    const ordersURL =
      "https://rahulshettyacademy.com/client/#/dashboard/myorders";
    await goToURL(page, ordersURL);

    //Verify the order send it not our order associated with the user and return 401 type error
        //this is the api call that is giving us the view of my orders and YOU HAVE TO CALL THIS FIRST SO PLAYWRIGHT KNOWS WHAT TO INjECT
    //WHEN IT REACHES THE ACTUAL MY ORDERS PAGE, that is why we went to my order list page first above, did the hijacking of the request and
    //ONLY THEN clicked on the my orders below that i am interesting in ivewiring
        //https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=6994f6a91fe6115f6a8f3e87
            //however because the /6983d5dfc941646b7ad54f39 is associated with a user we want to ensure our test works for all
            //and every user so we put /** OR /* at the end of the url so it will take into acccount ANY USER
    const myOrderURL =
      "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*";
    const notMyOrderURL =
      "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=621661f884b053f6765465b6";

    await page.route(myOrderURL, async (route) => {
      //intercepting request and saying abvoe start at myOrderURL, then hijack the request and go to an order which is not associated with our user
      route.continue({ url: notMyOrderURL });
    });

    //await page.getByRole('button', { name: 'View' }).click()
    //verify my orders page loaded and click on the viw button to assert the error is seen
    const yourOrderList = page.locator("th[scope='row']");
    //need to wait for the values to be visible before grabbing them
    //A good rule of thumb is: If a method returns an Array immediately, you usually need to await a visibility check first.
    await expect(yourOrderList.first()).toBeVisible();

    //click on first view button
    await page.locator("tr").getByRole("button", { name: "View" }).first().click();
    
    const four01Error = await page.locator(".blink_me").textContent();
    console.log(four01Error);

    expect(four01Error).toEqual("You are not authorize to view this order");


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
