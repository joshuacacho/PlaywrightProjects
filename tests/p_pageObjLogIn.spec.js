const { test, expect } = require("@playwright/test");

//when using the Page Object Manager to contain all of our Page Objects we DONT NEED THE BELOW
  //commenting out
// const { LoginPage } = require("../pageObjects/loginPage.js");
// const { DashboardPage } = require("../pageObjects/dashboardPage.js");

const { PageObjectManager } = require("../pageObjects/pageObjectManager");


//user name and password
//testUser63@example.com/Test@1234
const username = "testUser63@example.com";
const password = "Test@1234";


test("Page Object UI - Login to E-Commerce Application", async ({ page }) => {
  try {

    //initiate Page Object MAnager Class now
    const pObjManager = new PageObjectManager(page);

    //if you dont pasas the page value (same as in the constructor) then you will be unable to read page objects
      //TypeError: Cannot read properties of undefined (reading 'locator')
      //Part of page object manager
      //when using the Page Object Manager to contain all of our Page Objects we DONT NEED THE BELOW
      //commenting out
    //const loginPage = new LoginPage(page);
    const loginPage =  pObjManager.getLoginPage();
    
    //navigate to url
    loginPage.goToLoginPage();

    //fill in credentials to log in
    loginPage.attemptLogin(username,password);

    //assert successful login by verifying url goes to the client dashboard
    await expect(page).toHaveURL(/.*client\/#\/dashboard/);


    

    //add random item to cart
      //Part of page object manager
      //when using the Page Object Manager to contain all of our Page Objects we DONT NEED THE BELOW
      //commenting out
    //const dashboardPage = new DashboardPage(page);
    const dashboardPage = pObjManager.getDashboardPage();  //dont need new pObjManager because the NEW pObjManager is defined at the top

    //assert iphone 13 pro is on page
    const isProductSeen = await dashboardPage.verifyProductExists("iphone 13 pro");
    //console.log(isProductSeen);
    expect(isProductSeen).toBeTruthy();

    //add random item to cart
    dashboardPage.addRandomItemToCart();

    //wait on the dashboard toast to confirm something got addded to the cart successfully
      //many things like visible will not work as its always on the page, just hidden and does not have any associated attributes
    await dashboardPage.cartCountSuccToast.first().waitFor();;
    await dashboardPage.itemsInCart.click();

    //assert successful login by verifying url goes to the client dashboard
    await expect(page).toHaveURL(/.*client\/#\/dashboard\/cart/);

    //wait for get-cart-count api response to be return before grabbing it below
    const getCartCount = "https://rahulshettyacademy.com/api/ecom/user/get-cart-count/**"
    await page.waitForResponse(getCartCount);

    //obtain cardCountLabel numberic value and expect it to equal 1
    let cartCountImageLabel = await dashboardPage.getCartCount();
    expect(cartCountImageLabel).toContain("1");


  } catch (error) {
    console.error(error.stack);
  }
});

