const { test, expect } = require('../../pageObjects/FullBookingFlow_EventCreation/pageObjectFixtures');
const { baseURL, defaultCustomer } = require('./testData/credentials');
const {
  bookFirstEventDefaultTicket,
  goToFirstBookingDetail,
  validateBookingRefMatches,
  checkRefundEligibility,
} = require('../../pageObjects/FullBookingFlow_EventCreation/helpers/bookingFlowSteps');

test('Single ticket booking is eligible for refund', async ({ loggedInPage }) => {
  const { page, homeEvntPage, evntDetailsPage, myBookingsPage, myBookingsDetailsPage } = loggedInPage;
  let bookingCode;

  await test.step('Book first event with 1 ticket', async () => {
    await bookFirstEventDefaultTicket(homeEvntPage, evntDetailsPage, defaultCustomer);
    await expect(page).toHaveURL(baseURL + '/events/3');
  });

  await test.step('Navigate to booking detail', async () => {
    bookingCode = await goToFirstBookingDetail(myBookingsPage);
    await expect(page).toHaveURL(baseURL + '/bookings');
  });

  await test.step('Validate booking ref matches', async () => {
    await validateBookingRefMatches(myBookingsDetailsPage, bookingCode);
  });

  await test.step('Check refund eligibility', async () => {
    await checkRefundEligibility(myBookingsDetailsPage);
  });

  await test.step('Validate refund result', async () => {
    await expect(myBookingsDetailsPage.refundEligiblityStatus)
      .toContainText('Eligible for refund. Single-ticket bookings qualify for a full refund.');
  });
});