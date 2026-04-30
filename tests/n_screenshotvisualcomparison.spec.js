const { test, expect } = require("@playwright/test");



test("Screenshot & Visual Comparison", async ({page}) => {
    //creating a new page using the webContext from .beforeAll with ALL OF THE
 
    //navigate to the URL without using the log in credentials again
    const automPracticeURL ="https://rahulshettyacademy.com/AutomationPractice/";
    await goToURL(page, automPracticeURL);

    //before screenshot of entire page
    await page.screenshot({path: 'entirepage.png'});

    //before screenshot of just text box area
    const hideTextBoxArea = page.locator(".right-align:nth-child(2)");
    await hideTextBoxArea.screenshot({path: 'textBoxBeforeHide.png'});

    //click to hide text box
    const hideTextBox = page.locator("#hide-textbox");
    await hideTextBox.click();

    //view text box
    const textBox = page.locator("#displayed-text");
    await expect(textBox).toBeHidden();

    //after screenshot
    await hideTextBoxArea.screenshot({path: 'textBoxAfterHide.png'});

})

test.only("Visual Screen Comparison With Screenshots", async ({page}) => {

    //navigate to the URL without using the log in credentials again
    const automPracticeURL ="https://rahulshettyacademy.com/AutomationPractice/";
    await goToURL(page, automPracticeURL);

    //before screenshot of entire page
      //await page.screenshot({path: 'entirepage.png'});

    //creation of baseline screenshot of just text box area
    const hideTextBoxArea = page.locator(".right-align:nth-child(2)");
    //await hideTextBoxArea.screenshot({path: 'textBoxBeforeHide.png'});

    // Wait for network to fully settle before screenshotting
    await page.waitForLoadState('networkidle');

    //now we will compare the baseliene screenshot we took above for the entire page
      //this will most likely never match because of the dynamic nature of the page, but it is a good example of how to do a visual comparison for the entire page
        //added maxDiffPixelRatio to allow for a small percentage of pixels to be different before the test fails, which is useful for dynamic pages where there may be slight variations in rendering or content that do not indicate a real issue
    expect(await page.screenshot({path: 'todayEntirePageSS.png'})).toMatchSnapshot('baselineEntirepage.png', { maxDiffPixelRatio: 0.01 });

    //now we will compare the baseline screenshot we took above for just the text box area
        //this will occur each time we do screenshots
    expect(await hideTextBoxArea.screenshot({path: 'textBoxTodaySS.png'})).toMatchSnapshot('baselineTextBoxArea.png');

})

//go to any url via bypassing login above (MUST COME AFTER)
async function goToURL(page, url) {
  try {
    await page.goto(url);
  } catch (error) {
    console.error(`❌ Failed to navigate to URL: ${url}`);
    throw error;
  }
}

