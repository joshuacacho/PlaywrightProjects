//User must be logged in to see these options

//Logged In Event User Page Objects for /admin/events page

const {expect} = require('@playwright/test');

class CreateEventFBFPage {

    constructor(page) {
        //activates browser for the entire page
        this.page = page;

        //define items that need to be used to. log in
        this.eventTitle = page.locator("#event-title-input");
        this.eventDescription = page.locator("textarea[placeholder='Describe the event…']");
        this.eventCategory = page.locator("#category");
        this.eventCity = page.getByLabel("City");  //Fill City field (locate by label City)
        this.eventVenue = page.getByLabel("Venue"); //Fill Venue field (locate by label Venue)
        this.eventDateTime = page.getByLabel("Event Date & Time"); //Fill Event Date & Time field (locate by label Event Date & Time) — use your futureDateValue() helper
        this.eventPrice = page.getByLabel("Price ($)");  //Fill Price ($) field (locate by label Price ($))
        this.eventTotalSeats = page.getByLabel("Total Seats");  //Fill Total Seats field (locate by label Total Seats) 
        this.addEventButton = page.locator("#add-event-btn");

        //optional
        this.eventImageURL = page.locator("#image-url-(optional)");

        //special - toast after event is created
        this.succEventCreatedToast = page.getByText("Event created!");
    }

    //go to admin events page
    async goToAdminEventsPage() {
        try {
            let adminEventsURL = "https://eventhub.rahulshettyacademy.com/admin/events";
            await this.page.goto(adminEventsURL);
        }
        catch (error) {
            console.error(error.stack);
            throw error;
        }
    }

    //return event title
    async eventTitleRandom() {
        const eventTitle = "My Event For " + Date.now();
        return eventTitle;
    }

    //Create Event
    async createEventFull(title, description, category, city, venue, daysAhead, price, totalSeats){
        try {
            //set all values on page
            await this.eventTitle.fill(title); //make the events unique
            console.log(title);
            await this.eventDescription.fill(description);
    
            //add defeensive coding to ensure event category is visible before entering
                // .fill takes care of this but for this object type we are using .selectOption
            // Guard: verify option exists before selecting
            await expect(this.eventCategory, "Event Category dropdown is NOT visible").toBeVisible();
            await this.eventCategory.selectOption({ value: category });
            await this.eventCity.fill(city); 
            await this.eventVenue.fill(venue); 
            
            //Event Date time has some data manipulation to return the expected date time format
                //view the setFutureDate method to see the reasoning
            const futureDate = await this.setFutureDate(daysAhead);
            console.log(futureDate)
            await this.eventDateTime.fill(futureDate);  //this returns 2026-06-18T13:58
    
            await this.eventPrice.fill(price);
            await this.eventTotalSeats.fill(totalSeats);
    
            // Guard: add Event button is visible before selecting
            await expect(this.addEventButton, "Add Event Button is NOT visible").toBeVisible();
            await this.addEventButton.click();
    

        } catch (error) {
            console.error(error.stack);
            throw error
        }
    }

    //obtain future date
    async setFutureDate(daysAhead) {

        try {
            //NOTE
            //date and time values are very specific so its not a good idea to assume what the format "might be"
            //to find out the specific date time format you can use the below
            const inputType = await this.eventDateTime.getAttribute('type');
            console.log(inputType); // tells you exactly what format is needed which is datetime-local
        
            //now we can return the value in the expected format and set it in the future
            let futureDate = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);
            return futureDate.toISOString().slice(0, 16); // "2026-06-18T13:58"

            /*
                The key takeaway:
                Display to users → toLocaleString('en-US') (readable)
                HTML datetime-local inputs → toISOString().slice(0, 16) (strict format)
                Databases → usually ISO format toISOString() or YYYY-MM-DD
            */
        } catch (error) {
            console.error(error.stack);
            throw error;
        }
        
    }
   
}

module.exports = { CreateEventFBFPage };