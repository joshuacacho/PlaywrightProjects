const { test, expect } = require("@playwright/test");

const homePageURL = "https://rahulshettyacademy.com/AutomationPractice/";
// const homePageURL = "https://rahulshettyacademy.com/angularpractice";
// const shopPageURL = "https://rahulshettyacademy.com/angularpractice/shop";
// const selenPracticeURL =
//   "https://rahulshettyacademy.com/seleniumPractise/#/offers";

async function goToURL(page, url) {
  try {
    await page.goto(url);
  } catch (error) {
    console.error(`❌ Failed to navigate to URL: ${url}`);
    throw error;
  }
}

test("Going Back and Forth Between Two Web Pages", async ({ page }) => {
  await goToURL(page, homePageURL);
  await goToURL(page, "https://google.com");

  //goBack and goForward
  await page.goBack();
  await page.goForward();
  await page.goBack();
});

test("Hidden Elements - Text Box Not Hidden At Load Time", async ({ page }) => {
  await goToURL(page, homePageURL);

  const textBox = page.locator("#displayed-text");
  await expect(textBox).toBeVisible();
});

test("Hidden Elements - Text Box To Be Hidden After Clicking Hide", async ({
  page,
}) => {
  await goToURL(page, homePageURL);

  const hideTextBox = page.locator("#hide-textbox");
  await hideTextBox.click();

  const textBox = page.locator("#displayed-text");
  await expect(textBox).toBeHidden();
});

test("Hidden Elements - Text Box To Be Not Hidden After Clicking Hide Then Show", async ({
  page,
}) => {
  await goToURL(page, homePageURL);

  const hideTextBox = page.locator("#hide-textbox");
  await hideTextBox.click();

  const textBox = page.locator("#displayed-text");
  await expect(textBox).toBeHidden();

  const showTextBox = page.locator("#show-textbox");
  await showTextBox.click();
  await expect(textBox).toBeVisible();

  await page.pause();
});

test("Handling Alert Popups - Accept ", async ({ page }) => {
  await goToURL(page, homePageURL);

  //handling alert popups similar to jsconsole alert("hello");
  //alert popups ARE NOT Web popups (sometimes called dialogue)
  const confirmPopUpButton = page.locator("#confirmbtn");

  /*By default, dialogs are auto-dismissed by Playwright, so you don't have to handle them. However, you can register a dialog handler before the action that triggers the dialog to either dialog.accept() or dialog.dismiss() it.*/
  page.on("dialog", (dialog) => dialog.accept()); //click on [OK] button or positive button
  await confirmPopUpButton.click();
});

test("Handling Alert Popups - Dismiss ", async ({ page }) => {
  await goToURL(page, homePageURL);

  //handling alert popups similar to jsconsole alert("hello");
  //alert popups ARE NOT Web popups (sometimes called dialogue)
  const confirmPopUpButton = page.locator("#confirmbtn");

  /*By default, dialogs are auto-dismissed by Playwright, so you don't have to handle them. However, you can register a dialog handler before the action that triggers the dialog to either dialog.accept() or dialog.dismiss() it.*/
  page.on("dialog", (dialog) => dialog.dismiss()); //click on [Cancel] button or negative button
  await confirmPopUpButton.click();
});

test("Hovering Over Items - Selecting Item from List ", async ({ page }) => {
  await goToURL(page, homePageURL);

  //handling objects with hovering over
  const mouseHover = page.locator("#mousehover");
  mouseHover.hover();

  const selectHoverOption = page.locator(".mouse-hover-content");
  selectHoverOption.waitFor();

  const itemSelection = "Reload";
  await page.getByRole("link").filter({ hasText: itemSelection }).click();

  await page.pause();
});

test.only("Handling iFrames within a Page", async ({ page }) => {
  await goToURL(page, homePageURL);

  //best way is by name or id to locator an iFrame
    //url to find locators once iframe defined since its just the same page rendered 
        //https://legacy.rahulshettyacademy.com/lifetime-access
  const iFrame = page.frameLocator("#courses-iframe");
  await iFrame.getByRole("link").filter({ hasText: "All Access plan" }).click();

  //extract total subscriber count
    //this will work but there are 48 elements on the page but const subsriberCount = iFrame.locator(".content-side span").first(); assumes it always first
  //we can stay in the SAME iframe and keep getting locators because we are still in the iframe so dont need to do anything special
    //other than continue to locate value
  const subscriberCount = iFrame.locator(".text h2 span");
  console.log(await subscriberCount.textContent()); 


  //parsing out the subscriber count if it was one long text string using the " " icon 
    //Join 13,522 Happy Subscribers!
  const parseSubscriberCount = await iFrame.locator(".text h2").textContent();
  console.log(parseSubscriberCount);
  console.log( parseSubscriberCount.slice(" ")[1]);

  //navigating back to the main page (out of the iframe) you can simply just use page.locator like you have been instead of
    // iFrame.locator() when handling for example objects on the main page like with hovering over
  const mouseHover = page.locator("#mousehover");
  mouseHover.hover();

  await page.pause();

});
