//User must be logged in to see these options

//Logged In Home User Page Objects for /login page

class LoggedInFBFPage {

    constructor(page) {
        //activates browser for the entire page
        this.page = page;

        //define items that need to be used to. log in
        this.email = page.locator("#email");
        this.homeAnchor = page.locator("#nav-home");
        this.eventAnchor = page.locator("#nav-events");
    }

   
}

module.exports = { LoggedInFBFPage };