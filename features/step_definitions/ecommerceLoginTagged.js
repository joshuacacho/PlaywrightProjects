const assert = require('assert');
const { Given, When, Then, And, setDefaultTimeout } = require('@cucumber/cucumber');
const { test, expect } = require('@playwright/test');

//this is global timeout for all steps in the step definition file. It sets the default timeout for all steps to 10 seconds, which means that if any step takes longer than 10 seconds to execute, it will be considered a failure and will throw a timeout error. This is useful to prevent tests from hanging indefinitely and to ensure that they complete within a reasonable time frame.
setDefaultTimeout(10 * 1000); 

Given("Tagged the user navigates to the login page within {string}", { timeout: 10 * 1000 }, async function (loginPageURL) { 
    await this.page.goto(loginPageURL); // ✅ page already set up by Before hook
});

When("Tagged the user enters valid username {string} and the password {string}", async function (username, password) {
    await this.page.fill('#userEmail', username); // ✅ same page shared across steps
    await this.page.fill('#userPassword', password); // ✅ same page shared across steps
});
