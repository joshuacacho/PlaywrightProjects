//User must be logged in to see these options

//Logged In Event User Page Objects for /events page

class EventsFBFPage {

    constructor(page) {
        //activates browser for the entire page
        this.page = page;

        //define items that need to be used to. log in
        this.addNewEventButton = page.locator("button[type='button']");
        this.dataEvenCards = page.locator("article[data-testid='event-card']"); //Get all event cards (locate by data-testid="event-card")
        
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

   
}

module.exports = { EventsFBFPage };