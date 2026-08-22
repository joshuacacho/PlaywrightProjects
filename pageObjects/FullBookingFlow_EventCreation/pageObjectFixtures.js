// fixtures/pageObjectFixtures.js
const base = require('@playwright/test');
const { loginAndInitPageObjects } = require('../../pageObjects/FullBookingFlow_EventCreation/helpers/loginAndInitPageObjects.js');
const { email, password, baseURL, defaultCustomer } = require('../../tests/Sec9_Assignment1_FullBookingFlow/testData/credentials');

exports.test = base.test.extend({
  loggedInPage: async ({ browser }, use) => {
    const ctx = await loginAndInitPageObjects(browser, email, password);

    await use(ctx); // test gets { page, pObjManager, loginPage, homeEvntPage, evntDetailsPage, myBookingsPage, myBookingsDetailsPage, admEvntPage, postLoginHomePage, webContext }

    // cleanup — you were doing page.close() in afterAll before, do it here instead
    await ctx.page.close();
    await ctx.webContext.close();
  },
});

exports.expect = base.expect;
