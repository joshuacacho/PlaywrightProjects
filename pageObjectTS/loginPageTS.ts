//ADD FOR TypeScript
import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPageTS {
  
  //ADD FOR TypeScript
  page: Page;
  usserName: Locator;
  userPassword: Locator;
  signInButton: Locator;

  //innitialize all elements on the page with associated on variables at runtime for logging in
  //automatically intiialzied at run time
    ////ADD FOR TypeScript
  constructor(page: Page) {
    //activates page to be used everywhere in your class
    this.page = page;

    //intnialize variables and associated loctaors
    this.usserName = page.locator("#userEmail");
    this.userPassword = page.locator("#userPassword");
    this.signInButton = page.locator("#login");
  }

  //go to log in page 
  async goToLoginPage() {
    try {
      let loginURL = "https://rahulshettyacademy.com/client/#/auth/login/";
      await this.page.goto(loginURL);
    } catch (err) {  //UPDATE FOR TypeScript
      const error = err as Error
      console.error(error.stack);
    }
  }

  //validLogin
    //UPDATE FOR TypeScript
  async attemptLogin(username: string, password: string) {
    try {
      await this.usserName.fill(username);
      await this.userPassword.fill(password);
      await this.signInButton.click();
    } catch (err) {  //UPDATE FOR TypeScript
      const error = err as Error
      console.error(error.stack);
    }
  }
}

//DONT NEED THIS to export class to be used globally in typescript as long as you export the class itself above and import it in the test file where you want to use it
  //module.exports = { LoginPageTS };
