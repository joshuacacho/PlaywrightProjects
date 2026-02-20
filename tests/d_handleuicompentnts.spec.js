const {test, expect} = require('@playwright/test');
const { text } = require('node:stream/consumers');


let radioButton = "";

async function gotoLoginPage(page) {
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/#/");
}

test("UI - Static Dropdowns", async({page}) => {
    await gotoLoginPage(page);

    //select a static dropdown value
    const staticDropDown = page.locator("[data-style='btn-info']");
    await staticDropDown.selectOption("Consultant"); 
    //await page.pause();
    

});

test("UI - Radio Button Selections", async({page}) => {
    await gotoLoginPage(page);
    
    //click on the radio button
    selectCheckboxByValue(page, "user");
    //await page.pause();

    //click pop up window ok button
    await page.locator("#okayBtn").click();

    //assert to verify the user radio button is selected
    expect (await radioButton.isChecked()).toBeTruthy();
    await page.pause();
});

async function selectCheckboxByValue(page, value) {

    //select a specific radio button based on value
    const radioButtonValue = value;
    radioButton = page.locator(`[value=${radioButtonValue}]`);    
    await radioButton.click();
 
}

test("UI - Checkbox Selections", async({page}) => {
    //navigate to url
    await gotoLoginPage(page);
    
    //select the checkbox
    const checkbox = page.locator("#terms");    
    await checkbox.click();
    //await page.pause();

    //assert to verify the user radio button is selected
    expect (await checkbox.isChecked()).toBeTruthy();
    //await page.pause();
});


test("UI - Blinking URL Selection", async({page}) => {

    //navigate to url
    await gotoLoginPage(page);

    //Verify the tag name has the class attribute blinkingText
    const tagName = page.locator("[href*='documents-request']");
    await expect(tagName).toHaveAttribute("class", "blinkingText");

    //await page.pause();
});

test.only("UI - Free Access...Material URL Takes User To Correct Page and Has Correct Information", async({page}) => {
    
    //navigate to url
    await gotoLoginPage(page);


    //This pattern prevents flakiness by eliminating the race condition of the new page appearing before the listener is ready
    const newPage =  Promise.all(
        [page.waitForEvent('popup'), //to intercept the new tab that opens
            page.locator(".blinkingText").click()
        ]
    )
    
    //await popUpPromise to get the new page object tab
    const docRequestPage = await newPage;

      //grab new url text to assert you are on the correct page
    await expect(docRequestPage[0]).toHaveURL("https://rahulshettyacademy.com/documents-request");

    //verify text on the new page is correct
        //need to use new tab
    const infoText = docRequestPage[0].locator(".im-para.red");
    const textConent = await infoText.textContent();
    console.log(textConent.trim());

    //no need for await here since NOT performing any action, just assertion
    expect(textConent.trim()).toEqual("Please email us at mentor@rahulshettyacademy.com with below template to receive response");

    //await page.pause();


    //grab email text from the new page
    const mentorEmail =  await docRequestPage[0].locator(".red a").getAttribute("href");
    const finalEmail = mentorEmail.substring(7); //removes mailto:
    console.log("Final Email: " + finalEmail); //substring to remove mailto:

    //navigte back to main page and put finalEmail in the email field
    await page.bringToFront(); //brings focus back to main page
    await page.locator("#username").fill(finalEmail);

    //grab value from email field to verify correct email was entered
        //notice how THIS DOES NOT WORK
        console.log("Using Text Content: " + await page.locator("#username").textContent());

        //notice how THIS WORKS
        console.log("Using Input Value: " + await page.locator("#username").inputValue());

    await page.pause();
    

});


