// helpers/loginAndInitPageObjects.js
const { PageObjectManagerFBF } = require("../pageObjectFBFManager")
const { expect } = require('@playwright/test');

async function loginAndInitPageObjects(browser, email, password) {
    const context = await browser.newContext();
    // creates a new tab in the opened browser
    let page = await context.newPage();

    // initiate Page Object Manager Class
    let pObjManager = new PageObjectManagerFBF(page);

    // give life to the page objects of the login page
    const loginPage = pObjManager.getLoginPage();

    // navigate to the log in page
    await loginPage.goToLoginPage();

    // use the hardcoded credentials
    await loginPage.login(email, password);

    const postLoginHomePage = pObjManager.getLoggedInHomePage();

    // verify you are on the home page first with the Home button
    await expect(postLoginHomePage.homeAnchor).toBeVisible();

    // store storage state for reuse
    await context.storageState({ path: 'state.json' });

    // inject the state.json file in a new browser context
    const webContext = await browser.newContext({ storageState: 'state.json' });

    // ⚠️ CRITICAL: reassign page AND pObjManager to the NEW context
    page = await webContext.newPage();
    pObjManager = new PageObjectManagerFBF(page);

    // initialize all page objects ONCE
    const admEvntPage = pObjManager.getCreateEventPage();
    const homeEvntPage = pObjManager.getEventsHomePage();
    const evntDetailsPage = pObjManager.getEventDetailsPage();
    const myBookingsPage = pObjManager.getMyBookingsPage();
    const myBookingsDetailsPage = pObjManager.getmyBookingsDetailPage();

    console.log("Login and Page Object Init success");

    // return everything the tests will need
    return {
        webContext,
        page,
        pObjManager,
        loginPage,
        postLoginHomePage,
        admEvntPage,
        homeEvntPage,
        evntDetailsPage,
        myBookingsPage,
        myBookingsDetailsPage
    };
}

module.exports = { loginAndInitPageObjects };