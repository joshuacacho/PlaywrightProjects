//ADD FOR TypeScript
import { expect, type Locator, type Page } from '@playwright/test';

//either add these for Page Object Manager OR they will automatically be added
    //when you declare the Page Objects themselves within the constructor below
import { DashboardPageTS } from './dashboardPageTS';
import { LoginPageTS } from './loginPageTS';

export class PageObjectManagerTS {

    //ADD FOR TypeScript
    page: Page;
    loginPage: LoginPageTS;
    dashboardPage: DashboardPageTS;

    //declare PageObjects here that we will use
    constructor(page: Page) {
        //to make the page to be used everywhere
        this.page = page;

        this.loginPage = new LoginPageTS(this.page);
        this.dashboardPage = new DashboardPageTS(this.page);
    }

    //creating custom methods to get the different pages
    getLoginPage(): LoginPageTS {
        return this.loginPage;
    }

    getDashboardPage(): DashboardPageTS {
        return this.dashboardPage;
    }
}

//DONT NEED THIS to export class to be used globally in typescript as long as you export the class itself above and import it in the test file where you want to use it
    //module.exports = { PageObjectManagerTS };
