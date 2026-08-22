const {expect} = require('@playwright/test');

class MyBookingDetailsFBFPage {

    constructor (page) {

        this.page = page;

        this.bookingCode = page.locator(".text-gray-900.font-mono");
        this.checkRefundEligibility = page.getByTestId("check-refund-btn");  // similar to css id locator #check-refund-btn
        this.refundSpinner = page.getByTestId("refund-spinner");
        this.refundEligiblityStatus = page.getByTestId("refund-result");

    }


    async getMyBookingDetailsCode() {

        try {
            await expect(this.bookingCode, "My Bookings Details Code is Not Visible").toBeVisible();
            const bookingCodeEventDetails =  await this.bookingCode.textContent();
            console.log("bookingCodeEventDetails text is " + bookingCodeEventDetails);
            return bookingCodeEventDetails;

        } catch (error) {
            console.error(error.stack);
            throw error;
        }
   
    }

}

module.exports = { MyBookingDetailsFBFPage } 