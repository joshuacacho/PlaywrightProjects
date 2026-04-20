const { test, expect } = require("@playwright/test");

//Importing Project Manager Page Objects
const { PageObjectManager } = require("../pageObjects/pageObjectManager");


//user name and password
//testUser63@example.com/Test@1234
//COMMENT OUT THE BELOW as we will use the DATA DRIVEN METHOD now
// const username = "testUser63@example.com";
// const password = "Test@1234";

//Converting JSON object to a JavaScript Object to Access Easier
    //json -> string -> javascript object
const dataPlOrUNPW = JSON.parse(JSON.stringify(require("../utils/placeOrderUNPW.json")));


test("Page Object UI - Login to E-Commerce Application", async ({ page }) => {
  try {
    //initiate Page Object MAnager Class now
    const pObjManager = new PageObjectManager(page);

    //create new loginPage object referenceing the Page Object Manager
    const loginPage = pObjManager.getLoginPage();

    //navigate to url
    loginPage.goToLoginPage();

    //fill in credentials to log in
        //also updating usage of JSON file placeOrderUNPW
    loginPage.attemptLogin(dataPlOrUNPW.username, dataPlOrUNPW.password);

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
    const getCartCount = dataPlOrUNPW.cartCountURL;
    await page.waitForResponse(getCartCount);

    //obtain cardCountLabel numeric value and expect it to equal 1
    let cartCountImageLabel = await dashboardPage.getCartCount();
    expect(cartCountImageLabel).toContain("1");
  } catch (error) {
    console.error(error.stack);
  }
});
