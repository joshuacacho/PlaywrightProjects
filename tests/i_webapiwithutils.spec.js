//user name and password
//testUser63@example.com/Test@1234

const { test, expect, request } = require("@playwright/test");
//import { test, expect, request } from '@playwright/test';
//import { APIUtilities } from './utils/APIUtilities.cjs';
const { APIUtilities } = require('../utils/APIUtilities');

//global values
let response;
let token;


//url payload JSON has a javascript object of property and value
//only the value can be in quotes
const loginPayLoad = {
  userEmail: "testUser63@example.com",
  userPassword: "Test@1234",
};

//create payorder payload
const orderPayLoad = {
  orders: [{ country: "Cuba", productOrderedId: "6960eac0c941646b7a8b3e68" }],
};


test.beforeAll(async () => {
  try {
    //api context
    const apiContext = await request.newContext();
    const apiUtils = new APIUtilities(apiContext, loginPayLoad);
    response = await apiUtils.createOrder(orderPayLoad);

  } catch (error) {
    console.error(`❌ Failed to inject token to URL: ${token}`);
    console.error(error.stack);
    throw error;
  }
});

test.only("Place Order w/Utils folder for Optimization", async ({ page }) => {

  try{ 

    //grab token set above in .beforeAll login and use it here below when navigating to the URL
    await injectTokenLogin(page);

    //navigate to the URL
    const ordersURL = "https://rahulshettyacademy.com/client/#/dashboard/myorders";
    await goToURL(page, ordersURL);

    //we need token and 
    const finalOrderList = await returnOrderList(page);

    //assert order number is in table
    expect(finalOrderList).toContain(response.orderId);

  } catch (error) {
    console.error(error.stack);
  }
});


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
