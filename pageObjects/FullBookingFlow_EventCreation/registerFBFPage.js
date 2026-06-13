//Registration Page Objects for /register page

class RegisterPage {
    constructor(page) {
        //activates browser for entire page
        this.page = page;

        //all other items on the page
        this.regEmail = page.locator("#register-email");
        this.regPassword = page.locator("#register-password");
        /*
            At least 8 characters
            One uppercase letter (A–Z)
            One number (0–9)
            One special character (!@#$%^&*…
        */
        this.regConfirmPassword = page.locator("input[placeholder='Repeat your password']");
        this.regCreateAccountButton = page.locator("#register-btn");
    }

    //crete an account
    async createRegAccount(regEmail, regPassword, confirmPass) {
        try {
            await this.regEmail.fill(regEmail);
            await this.regPassword.fill(regPassword);
            await this.regConfirmPassword.fill(confirmPass);

            //clickSubmitButton
            await this.regCreateAccountButton.click();
        } catch (error) {
            console.error(error.stack)
            throw error;
        }
    }
}

module.exports = { RegisterPage };