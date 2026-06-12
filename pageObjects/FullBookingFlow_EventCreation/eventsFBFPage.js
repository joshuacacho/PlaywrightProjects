//User must be logged in to see these options

//Logged In Event User Page Objects for /events page

class EventsFBFPage {

    constructor(page) {
        //activates browser for the entire page
        this.page = page;

        //define items that need to be used to. log in
        this.addNewEventButton = page.locator("button[type='button']");
    }

   
}

module.exports = { EventsFBFPage };