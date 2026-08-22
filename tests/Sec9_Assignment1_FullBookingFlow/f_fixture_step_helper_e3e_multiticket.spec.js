const { test, expect } = require('../../pageObjects/FullBookingFlow_EventCreation/pageObjectFixtures');
const { baseURL, defaultCustomer } = require('./testData/credentials');
const {
  bookingFirstEventMultipleTickets,
  goToFirstBookingDetail,
  validateBookingRefMatches,
  checkRefundEligibility,
} = require('../../pageObjects/FullBookingFlow_EventCreation/helpers/bookingFlowSteps');


test('Multi-ticket booking is NOT eligible for refund', async ({ loggedInPage }) => {
  const { homeEvntPage, evntDetailsPage, myBookingsPage, myBookingsDetailsPage } = loggedInPage;
  let bookingCode;

  await test.step('Book first event with 3 tickets', async () => {
    await bookingFirstEventMultipleTickets(homeEvntPage, evntDetailsPage, defaultCustomer, 3);
  });

  await test.step('Navigate to booking detail', async () => {
    bookingCode = await goToFirstBookingDetail(myBookingsPage);
  });

  await test.step('Check refund eligibility', async () => {
    await checkRefundEligibility(myBookingsDetailsPage);
  });

  await test.step('Validate not eligible', async () => {
    await expect(myBookingsDetailsPage.refundEligiblityStatus)
      .toContainText('Not eligible for refund. Group bookings (3 tickets) are non-refundable.'); // match actual app copy
  });
});