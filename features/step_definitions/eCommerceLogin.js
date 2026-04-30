const assert = require('assert');
const { Given, When, Then, And, setDefaultTimeout } = require('@cucumber/cucumber');
const { test, expect } = require('@playwright/test');

//this is global timeout for all steps in the step definition file. It sets the default timeout for all steps to 10 seconds, which means that if any step takes longer than 10 seconds to execute, it will be considered a failure and will throw a timeout error. This is useful to prevent tests from hanging indefinitely and to ensure that they complete within a reasonable time frame.
setDefaultTimeout(10 * 1000); 

Given("Before All Hooks - the user navigates to the login page at {string}", { timeout: 10 * 1000 }, async function (loginPageURL) { 
    await this.page.goto(loginPageURL); // ✅ page already set up by Before hook
});

When("Before All Hooks - the user enters valid username {string} and password {string}", async function (username, password) {
    await this.page.fill('#userEmail', username); // ✅ same page shared across steps
    await this.page.fill('#userPassword', password); // ✅ same page shared across steps
});

//And cant be used, only Given, When, Then can be used in the step definition file. The And keyword is used in the feature file to make the steps more readable and to indicate that they are part of the same scenario. In the step definition file, we can use When for all the steps that are part of the same scenario, regardless of whether they are preceded by Given, When, or And in the feature file.
When("Before All Hooks - clicks the login button", async function () {
    await this.page.click('#login'); // ✅ same page shared across steps
})

Then("Before All Hooks - the user should be logged in successfully with the URL containing {string}", async function (loginURLFragment) {
    const currentURL = await this.page.url(); // ✅ same page shared across steps
    console.log("Current URL after login: " + currentURL); // ✅ log the current URL for debugging
    await expect(this.page).toHaveURL(/.*client\/#\/dashboard/)
});
