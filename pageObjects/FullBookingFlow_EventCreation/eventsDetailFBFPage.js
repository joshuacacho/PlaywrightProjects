//User must be logged in to see these options

//When viewing event details to book a ticket (Select book now associated with event first)

const {expect} = require('@playwright/test');

class EventDetailsFBFPage {

    constructor(page) {
        //activates browser for the entire page
        this.page = page;
        this.ticketCount = page.locator("#ticket-count");  //id #ticket-count has text 1 (default quantity)
        this.fullName = page.getByLabel("Full Name"); //Fill Full Name (locate by label Full Name)
        this.email = page.locator("#customer-email"); //Fill Email (locate by id #customer-email)
        this.phone = page.getByPlaceholder("+91 98765 43210"); //Fill Phone (locate by placeholder +91 98765 43210)
        this.confirmButton = page.locator("#confirm-booking");  //confirm button (locate by CSS class .confirm-booking-btn)
        this.bookingReference = page.locator(".booking-ref");  //Locate the booking reference element (locate by CSS class .booking-ref, take .first())
    }

    async getTicketCount() {
        try {
            //Guard to check for ticket count to be visible
            await expect(this.ticketCount, "Ticket Count is not visible").toBeVisible();

            const ticketCount = await this.ticketCount.textContent();
            return parseInt(ticketCount.trim());
        } catch (error) {
            console.error(error.stack);
            throw error;
        }
    }


    //book tickets but DONT update anything outside of the fields below
        //i.e. leave the tickets at count 1, etc...
    async bookTicketsNoUpdate(fullName, email, phone) {
        try {
            await this.fullName.fill(fullName);
            await this.email.fill(email);
            await this.phone.fill(phone);

            //Guard to check for confirm button is presnet
            await expect(this.confirmButton, "Confirm button is not visible").toBeVisible();
            await this.confirmButton.click();

      
        } catch (error) {
            console.error(error.stack);
            throw error;
        }

    }

    //get booking refence
    async getBookingReference() {
        try {
            //Guard to check for ticket count to be visible
            await expect(this.bookingReference, "Booking Reference is not visible").toBeVisible();

            const bookingReference = await this.bookingReference.textContent();
            return bookingReference;
        } catch (error) {
            console.error(error.stack);
            throw error;
        }
    }


}

module.exports = { EventDetailsFBFPage };