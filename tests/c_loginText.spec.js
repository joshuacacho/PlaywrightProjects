//Challenge
//Create a new user and log into the application


const {test, expect} = require('@playwright/test');


 //create random number to attach to email to make it unique
const randomNumber = Math.floor(Math.random() * (1000 - 1 + 1)) + 1;
let email = "testUser" + randomNumber + "@example.com";
const passWord = "Test@1234";
const homePageURL = "https://rahulshettyacademy.com/client/#/auth/login"


test("UI - Create New User", async ({page}) => {

   
    //navigate to url
    await page.goto(homePageURL);

    //click on create new account link
    await page.locator(".text-reset").click();

    //assert correct page loads in flow
    await expect(page).toHaveURL(/.*register/);

    //fill in new user details
        //text
        await page.locator("#firstName").fill("testUser");
        await page.locator("#lastName").fill("automation");
        
        await page.locator("#userEmail").fill(email);
        await page.locator("#userMobile").fill("8589875471");

        //Drop Down occupation
        await page.locator("[formcontrolname='occupation']").selectOption("Doctor");
    
        //Radio Button selection
        await page.locator("[formcontrolname='gender']").nth(1).click(); //male

        //Fill in password and confirm password
        await page.locator("#userPassword").fill(passWord);
        await page.locator("#confirmPassword").fill(passWord);

        //confirm you are over 18 checkbox
        await page.locator("[formcontrolname='required']").click();

        //Register button
        await page.locator("#login").click();


        //assert registration success message
        const successMessage = await page.locator(".headcolor").textContent();
        expect(successMessage.trim()).toEqual("Account Created Successfully");

        //Click on go to login button
        await page.locator("[routerlink='/auth']").click();
    
    //assert correct page loads in flow
    await expect(page).toHaveURL(/.*login/);

    //fill in credentials to log in
    await page.locator("#userEmail").fill(email);
    await page.locator("#userPassword").fill(passWord);

    //click Log in button
    await page.locator("#login").click();

    //assert successful login by verifying url goes to the client dashboard
    await expect(page).toHaveURL(/.*client\/#\/dashboard/);

    

});


//Bonus Challenge
//From the product page print out the first product name in the list
test("UI - Print First Product Name", async ({page}) => {

    //navigate to url
    await page.goto(homePageURL);

    //sign in
    //fill in credentials to log in
    await page.locator("#userEmail").fill(email);
    await page.locator("#userPassword").fill(passWord);

    //click Log in button
    await page.locator("#login").click();

    //assert successful login by verifying url goes to the client dashboard
    await expect(page).toHaveURL(/.*client\/#\/dashboard/);

    //from the product page get the first item and print out its text
    const cards =  page.locator(".card-body b");
    const firstCardText =  await cards.nth(0).textContent();
    console.log("First Card Text: " + firstCardText.trim());

    expect (firstCardText.trim()).toEqual("Automation 8"); 
});


/*
optimized
*/

    // const { test, expect } = require('@playwright/test');

    // // Define helper functions to navigate to the login page and fill in the form
    // async function gotoLoginPage(page) {
    //   await page.goto('https://example.com/login'); // Replace with actual URL
    // }

    // async function fillLoginForm(page, username, password) {
    //   await page.fill('#username', username); // Replace '#username' with actual selector
    //   await page.fill('#password', password); // Replace '#password' with actual selector
    // }

    // // Use these helper functions in your tests
    // test('should allow valid user to log in', async ({ page }) => {
    //   await gotoLoginPage(page);
    //   await fillLoginForm(page, 'validUsername', 'validPassword');

    //   // Add assertions here to verify successful login
    //   await expect(page).toHaveURL(/.*dashboard/); // Replace /.*dashboard/ with actual URL pattern
    // });

    // test('should disallow invalid user to log in', async ({ page }) => {
    //   await gotoLoginPage(page);
    //   await fillLoginForm(page, 'invalidUsername', 'invalidPassword');

    //   // Add assertions here to verify unsuccessful login
    //   await expect(page.locator('#error-message')).toContainText('Invalid credentials'); // Replace '#error-message' and 'Invalid credentials' with actual selectors and text
    // });
