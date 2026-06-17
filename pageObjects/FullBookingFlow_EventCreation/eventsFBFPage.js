//User must be logged in to see these options

//Logged In Event User Page Objects for /events page

const {expect} = require('@playwright/test');

class EventsFBFPage {

    constructor(page) {
        //activates browser for the entire page
        this.page = page;

        //define items that need to be used to. log in
        this.addNewEventButton = page.locator("button[type='button']");
        this.dataEventCards = page.locator("article[data-testid='event-card']"); //Get all event cards (locate by data-testid="event-card")
        this.bookNowButtons = page.locator("#book-now-btn");
        this.eventsLink = page.locator("#nav-events");
    }

    async goToEventsPage() {
        try {
            let eventsPageURL = "https://eventhub.rahulshettyacademy.com/events";
            await this.page.goto(eventsPageURL);
        } catch (error) {
            console.error(error.stack);
            throw error;
        }
    }

    async goToMyEventsPageLink() {
    
        try {
            await expect(this.eventsLink, "Events  Link is Not Visible").toBeVisible();
            await this.eventsLink.click();
        } catch (error) {
            console.error(error.stack);
            throw error;
        }
       
        }
   
}

module.exports = { EventsFBFPage };