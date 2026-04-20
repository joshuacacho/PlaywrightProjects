//either add these for Page Object Manager OR they will automatically be added
    //when you decalre the Page Objects themselves within the constructor below
const { DashboardPage } = require("./dashboardPage");
const { LoginPage } = require("./loginPage");

class PageObjectManager {

    //declare PageObjects here that we will use
    constructor(page) {
        //to make the page to be used everywhere
        this.page = page;

        this.loginPage = new LoginPage(this.page);
        this.dashboardPage = new DashboardPage(this.page);
    }

    //creating custom methods to get the different pages
    getLoginPage() {
        return this.loginPage;
    }

    getDashboardPage() {
        return this.dashboardPage;
    }
}

//export class to be used globally
module.exports = { PageObjectManager };
