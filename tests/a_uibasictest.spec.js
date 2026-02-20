/*import annotation and assign to cont variable test*/
const {test, expect} = require('@playwright/test');


//associating our cont variable with our test case using ONLY browser
test("UI Basic Test - Browser Only", async ({browser}) => {

    //playwright code
        /*
        1. Open the browser 
        2. Enter username and password
        3. Log in
        4. Verify the home page
        5. Log out
        */

    //1. Open the browser instanc
        //which browser are we opening? -> defined in the playwright.config.js file
    const context = await browser.newContext();
    //1a. Open new page 
        //creates a new tab in the opened browser
    const page = await context.newPage();
    //1b. Navigate to the URL
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/#/"); 
});

//creating another test case using PAGE object only
test("UI Basic Test - Page Object", async ({page}) => {

    //get tthe title of the page and ensure its correct
    await page.goto("https://google.com"); 
    const pageTitle = await page.title();

    //assertion to verify the title using expect keyword 

        //with toBe method which takes a variable as parameter
        await expect(pageTitle).toBe("Google")
        //with toHaveTitle method which only takes page object ONLY as parameter
        await expect(page).toHaveTitle("Google");
            //i.e this would fail
            //await expect(pageTitle).toHaveTitle("Google");

});


//creating another test using the keywors test.only so only this test will run
test("UI Basic Test - Only This Test", async ({page}) => {
    //playwright code
     await page.goto("https://bing.com");
});