//create new account


const {test, expect} = require('@playwright/test');

const { PageObjectManagerFBF } = require("../../pageObjects/FullBookingFlow_EventCreation/pageObjectFBFManager");


test("Create New Registration Account", async ({ page }) => {

  try {

      //initiate Page Object MAnager Class now and 
      const pObjManager = new PageObjectManagerFBF(page);

      //give life to the page objects of the login page
      const loginPage =  pObjManager.getLoginPage();
      
      //navigate to  https://eventhub.rahulshettyacademy.com/login
      await loginPage.goToLoginPage();

      //select the registration link
      await loginPage.registerLink.click();

      //assert successful login by verifying url goes to the register page
      await expect(page).toHaveURL(/.*register/);

      //give life to the page objects of the registration page
      const regPage = pObjManager.getRegisterPage(); 

      //create registration account
      await regPage.createRegAccount("joeylorenzo44_7@yahoo.com", "C@rdionet#1", "C@rdionet#1");

      //assert you have reached the NEW USER home page indicating the account was creating successfully
      //give life to the page objects of the registration page
      const userHomePage = pObjManager.getLoggedInHomePage(); 

      //verify you are on the home page first with the Home button
      await expect(userHomePage.homeAnchor).toBeVisible();

      //verify the url is correct
      const returnURL = page.url();
      console.log(returnURL);
      await expect(returnURL).toBe("https://eventhub.rahulshettyacademy.com/")
         

  } catch (error) {
    console.log(error.stack)
  }
});