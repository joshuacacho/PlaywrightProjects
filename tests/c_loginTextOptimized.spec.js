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
    await gotoLoginPage(page);

    //click on create new account link
    await page.locator(".text-reset").click();

    //assert correct page loads in flow
    await expect(page).toHaveURL(/.*register/);

    //fill in new user details
    await fillLoginCredentials(page, "Test", "User", email, "1234567890", "Doctor", 1, passWord, passWord);
    console.log(email)

    //assert registration success message
    const successMessage = await page.locator(".headcolor").textContent();
    expect(successMessage.trim()).toEqual("Account Created Successfully");

    //Click on go to login button
    await page.locator("[routerlink='/auth']").click();
    
    //assert correct page loads in flow
    await expect(page).toHaveURL(/.*login/);

    //fill in credentials to log in
    await login(page, email, passWord);
  
    //assert successful login by verifying url goes to the client dashboard
    await expect(page).toHaveURL(/.*client\/#\/dashboard/);

    

});


//Bonus Challenge
//From the product page print out the first product name in the list
test("UI - Print First Product Name", async ({page}) => {

    //navigate to url
    await gotoLoginPage(page);

    //fill in credentials to log in
    await login(page, email, passWord);

    //assert successful login by verifying url goes to the client dashboard
    await expect(page).toHaveURL(/.*client\/#\/dashboard/);

    //wait for the network to become idle
        //this means the step will wait until all the network connections are done loading
            //ensuring we get the full list of products before we try to grab them
    //await page.waitForLoadState('networkidle');

    //if the above does not work we can do the following to find a single item on the page
    await page.locator(".card-body b").first().waitFor();

    //from the product page get the first item and print out its text
    const cards =  page.locator(".card-body b");
    const firstCardText =  await cards.nth(0).textContent();
    console.log("First Card Text: " + firstCardText.trim());

    expect (firstCardText.trim()).toEqual("Automation 8"); 
});


//He;per Functions

//helper function for navigateing to login page
async function gotoLoginPage(page) {
    await page.goto(homePageURL); // Replace with actual URL
}

//helper function to fill in login credentials
async function fillLoginCredentials(page, firstName, lastName, email, mobile, occupation, gender, password, confirmPassword) {

   //text
    await page.locator("#firstName").fill(firstName);
    await page.locator("#lastName").fill(lastName);
        
    await page.locator("#userEmail").fill(email);
    await page.locator("#userMobile").fill(mobile);

    //Drop Down occupation
    await page.locator("[formcontrolname='occupation']").selectOption(occupation);
    
    //Radio Button selection
    await page.locator("[formcontrolname='gender']").nth(gender).click(); //1 is male 2 is femaale

    //Fill in password and confirm password
    await page.locator("#userPassword").fill(password);
    await page.locator("#confirmPassword").fill(confirmPassword);
    //confirm you are over 18 checkbox
    await page.locator("[formcontrolname='required']").click();

    //Register button
    await page.locator("#login").click();
}

//helper function for logging in
async function login(page, email, password) {
    //fill in credentials to log in
    await page.locator("#userEmail").fill(email);
    await page.locator("#userPassword").fill(password); 

    //click Log in button
    await page.locator("#login").click();
}
