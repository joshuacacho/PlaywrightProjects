//either add these for Page Object Manager OR they will automatically be added
    //when you decalre the Page Objects themselves within the constructor below

const { LoginFBFPage } = require("./loginFBFPage");
const { RegisterPage } = require("./registerFBFPage");
const { LoggedInFBFPage } = require("./loggedinFBFPage");
const { EventsFBFPage } = require("./eventsFBFPage");
const { CreateEventFBFPage } = require("./createEventFBFPage");

class PageObjectManagerFBF {

    //declare PageObjects here that we will use
    constructor(page) {
        //to make the page to be used everywhere
        this.page = page;

        this.loginPage = new LoginFBFPage(this.page);
        this.registerPage = new RegisterPage(this.page);
        this.loggedInHomePage = new LoggedInFBFPage(this.page);
        this.eventsPage = new EventsFBFPage(this.page);
        this.createEventPage = new CreateEventFBFPage(this.page);
    }

    //creating custom methods to get the different pages
    getLoginPage() {
        return this.loginPage;
    }

    getRegisterPage() {
        return this.registerPage;
    }

    //user must be logged in
    getLoggedInHomePage() {
        return this.loggedInHomePage;
    }

    //user must be logged in
    getEventsHomePage() {
        return this.eventsPage;
    }

    //user must be logged in
    getCreateEventPage() {
        return this.createEventPage;
    }
}

//export class to be used globally
module.exports = { PageObjectManagerFBF };
