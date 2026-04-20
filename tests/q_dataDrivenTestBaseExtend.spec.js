const { test, expect } = require("@playwright/test");
const { PageObjectManager } = require("../pageObjects/pageObjectManager");

//use the basetest.js File for single value data driven object
const { customTests } = require("../utils/baseTest");


//passing the custom test
customTests("Page Object UI - Base Extend Custom Test", async ({page, testDataForOrder}) => {
  try {
    //initiate Page Object MAnager Class now
    const pObjManager = new PageObjectManager(page);

    //create new loginPage object referencing the Page Object Manager
    const loginPage = pObjManager.getLoginPage();

    //navigate to url
    loginPage.goToLoginPage();

    //fill in credentials to log in
    //also updating usage of JSON file placeOrderUNPW
    loginPage.attemptLogin(testDataForOrder.username, testDataForOrder.password);

    //assert successful login by verifying url goes to the client dashboard
    await expect(page).toHaveURL(/.*client\/#\/dashboard/);

    //create new dashboardPage object referenceing the Page Object Manager
    const dashboardPage = pObjManager.getDashboardPage(); //dont need new pObjManager because the NEW pObjManager is defined at the top
    dashboardPage.addRandomItemToCart();

    //wait on the dashboard toast to confirm something got addded to the cart successfully
    //many things like visible will not work as its always on the page, just hidden and does not have any associated attributes
    await dashboardPage.cartCountSuccToast.first().waitFor();
    await dashboardPage.itemsInCart.click();

    //assert successful login by verifying url goes to the client dashboard
    await expect(page).toHaveURL(/.*client\/#\/dashboard\/cart/);

    //wait for get-cart-count api response to be return before grabbing it below
    //also updating usage of JSON file placeOrderUNPW
    const getCartCount = testDataForOrder.cartCountURL;
    await page.waitForResponse(getCartCount);

    //obtain cardCountLabel numeric value and expect it to equal 1
    let cartCountImageLabel = await dashboardPage.getCartCount();
    expect(cartCountImageLabel).toContain("1");
  } catch (error) {
    console.error(error.stack);
  }
});
