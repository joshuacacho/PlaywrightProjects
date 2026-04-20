/*import annotation and assign to cont variable test*/
const {test, expect} = require('@playwright/test');


test("@Login UI - Incorrect Login - Capture Error Message", async ({page}) => {
 
    //go to login page
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/#/"); 
   
    const username = page.locator("#username");
    await username.fill("incorrectUser");
    const password =  page.locator("#password");
    await password.fill("incorrectPass");

    await page.locator("#signInBtn").click();

    //capture the error message displayed
    const errorMessage = await page.locator(".alert").textContent();
    console.log(errorMessage.trim());

    //verify the error message is correct
    expect(errorMessage.trim()).toEqual("Incorrect username/password.");

    //clear the fields for the next text
    await username.clear();
    await password.clear();

});


//creating another test case using valid username and password to verify successful login
test.only("@Login UI Basic Test - Successful Login", async ({page}) => {

    //go to login page
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/#/"); 
    

    //identifying and filling in username and password field and filling it in
        //playwright uses CSS and XPath selectors to identify elements on the page
        //Username is rahulshettyacademy and 
        //Password is Learning@830$3mK2

    await page.locator("#username").fill("rahulshettyacademy"); 
    await page.locator("#password").fill("Learning@830$3mK2"); 

    //click on sign in button
    await page.locator("#signInBtn").click();

    //wait for card to be visitible on the next page
    await page.waitForSelector(".card");

   //assert to verify the url has the correct value after login by
       //waiting for the page to load the shop page and asserting the url contains /shop
            //await page.waitForURL("**/shop");
            //await expect(page.url()).toContain("/shop");
       //without waiting for the url to load, directly asserting the url       
     await expect(page).toHaveURL(/.*shop/);


    //Post Successful Login - Grab Title Of First Production on the Page
    //grab all the card items
    const cards =  page.locator(".card-title a");
    const cardCount =  await cards.count();

    //grab the first item text content from the list of cards
    const firstCardText =  await cards.nth(0).textContent();
    console.log("First Card Text: " + firstCardText.trim());

    expect (firstCardText.trim()).toEqual("iphone X")

    //printing out all cards using for loop
        //retruns text string by string for each item in the list
    for (let i=0; i< cardCount; i++) {
        let productName =  await cards.nth(i).textContent();  
        console.log(productName.trim());
    }

    //printing out all items using keyword
        //returns an array of all text contents

    //this wont work since there are multiple items so we need to wait for them to be visible first
        //await cards.waitFor({ state: 'visible' });
    //await page.waitForSelector(".card");
    console.log(await cards.allTextContents());


});



