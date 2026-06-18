//Login Page Objects for /login page

const {expect} = require('@playwright/test');

class LoginFBFPage {

    constructor(page) {
        //activates browser for the entire page
        this.page = page;

        //define items that need to be used to. log in
        this.email = page.locator("#email");
        this.userPassword = page.locator("#password");
        this.signInButton = page.locator("#login-btn");
        this.registerLink = page.getByRole('link', { name: 'Register' });  //not every locator works
    }

    //go to log in page
    async goToLoginPage() {
        try {
            let loginURL = "https://eventhub.rahulshettyacademy.com/";
            await this.page.goto(loginURL);
        }
        catch (error) {
            console.error(error.stack);
            throw error;
        }
    }

    async login(email, password) {
        try {
            await this.email.fill(email);
            await this.userPassword.fill(password);

            await expect(this.signInButton, "sign in button is not visible").toBeVisible();
            await this.signInButton.click();
        } catch (error) {
            console.error(error.stack);
            throw error;
        }
    }

    

        
}

module.exports = { LoginFBFPage };