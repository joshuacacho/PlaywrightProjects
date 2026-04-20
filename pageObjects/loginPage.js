class LoginPage {
  
  
  //innitialize all elements on the page with associated on variables at runtime for logging in
  //automatically intiialzied at run time
  constructor(page) {
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
    } catch (error) {
      console.error(error.stack);
    }
  }

  //validLogin
  async attemptLogin(username, password) {
    try {
      await this.usserName.fill(username);
      await this.userPassword.fill(password);
      await this.signInButton.click();
    } catch (error) {
      console.error(error.stack);
    }
  }
}

module.exports = { LoginPage };
