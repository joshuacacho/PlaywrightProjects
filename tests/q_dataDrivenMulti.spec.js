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
//NOW WE HAVE MULTIPLE SETS OF DATA
const dataPlOrUNPW = JSON.parse(
  JSON.stringify(require("../utils/placeOrderUNPW.json")),
);

//write for loop to iterate through sets of data if we wanted to repeat the SAME TEST FOR MULTIPLE sets of data
//bellow in the for each loop we put the data.username and data,password to iterate through all sets of data within the JSON file
for (const data of dataPlOrUNPW) {
  //if you use a for loop and iterate through different data sets YOU MUST have UNIQUE test titles, so
    //adding the literal string username which is unique now gives this for loop and test run a dynamic title 
  test(`Page Object UI - Multiple Data Set - ALL - to E-Commerce Application [${data.username}]`, async ({page,}) => {
    try {
      //initiate Page Object MAnager Class now
      const pObjManager = new PageObjectManager(page);

      //create new loginPage object referenceing the Page Object Manager
      const loginPage = pObjManager.getLoginPage();

      //navigate to url
      loginPage.goToLoginPage();

      //fill in credentials to log in
      //also updating usage of JSON file placeOrderUNPW
      loginPage.attemptLogin(
        data.username,
        data.password,
      );

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
      const getCartCount = data.cartCountURL;
      await page.waitForResponse(getCartCount);

      //obtain cardCountLabel numeric value and expect it to equal 1
      let cartCountImageLabel = await dashboardPage.getCartCount();
      expect(cartCountImageLabel).toContain("1");
    } catch (error) {
      console.error(error.stack);
    }
  });
}

//accessing the data from the array using the original dataPlOrUNPW declaration via index
test("Page Object UI - Multiple Data Set - Single - to E-Commerce Application", async ({page,}) => {
  try {
    //initiate Page Object MAnager Class now
    const pObjManager = new PageObjectManager(page);

    //create new loginPage object referenceing the Page Object Manager
    const loginPage = pObjManager.getLoginPage();

    //navigate to url
    loginPage.goToLoginPage();

    //fill in credentials to log in
    //also updating usage of JSON file placeOrderUNPW
    loginPage.attemptLogin(dataPlOrUNPW[1].username, dataPlOrUNPW[1].password);

    //assert successful login by verifying url goes to the client dashboard
    await expect(page).toHaveURL(/.*client\/#\/dashboard/);

    //create new dashboardPage object referenceing the Page Object Manager
    const dashboardPage = pObjManager.getDashboardPage(); //dont need new pObjManager because the NEW pObjManager is defined at the top
    dashboardPage.waitForFirstCard();
    dashboardPage.addRandomItemToCart();

    //wait on the dashboard toast to confirm something got addded to the cart successfully
    //many things like visible will not work as its always on the page, just hidden and does not have any associated attributes
    await dashboardPage.cartCountSuccToast.first().waitFor();
    await dashboardPage.itemsInCart.click();

    //assert successful login by verifying url goes to the client dashboard
    await expect(page).toHaveURL(/.*client\/#\/dashboard\/cart/);

    //wait for get-cart-count api response to be return before grabbing it below
    //also updating usage of JSON file placeOrderUNPW
    const getCartCount = dataPlOrUNPW[1].cartCountURL;
    await page.waitForResponse(getCartCount);

    //obtain cardCountLabel numeric value and expect it to equal 1
    let cartCountImageLabel = await dashboardPage.getCartCount();
    expect(cartCountImageLabel).toContain("1");
  } catch (error) {
    console.error(error.stack);
  }
});
