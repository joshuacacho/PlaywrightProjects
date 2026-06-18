//My Bookings Page for all my bookings
    //must have at least 1 booking created


const {expect} = require('@playwright/test');

class MyBookingsFBFPage {

    constructor (page) {

        this.page = page;

        this.myBookingsLink = page.locator("#nav-bookings");
        this.bookingCards = page.locator("#booking-card");
        this.viewDetailButtons = page.getByRole( 'button', { name: 'View Details'});
        this.bookingReference = page.locator(".booking-ref");

    }


    async goToMyBookingsPage() {

        try {
            await expect(this.myBookingsLink, "My Bookings Link is Not Visible").toBeVisible();
            await this.myBookingsLink.click();
        } catch (error) {
            console.error(error.stack);
            throw error;
        }
   
    }
}

module.exports = { MyBookingsFBFPage } 