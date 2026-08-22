// helpers/bookingFlowSteps.js
const { expect } = require('@playwright/test');

async function bookFirstEventDefaultTicket(homeEvntPage, evntDetailsPage, customer) {
  await homeEvntPage.goToEventsPage();
  await expect(homeEvntPage.dataEventCards.first(), 'Data Event Cards Not Visible').toBeVisible();

  const firstEventCard = homeEvntPage.dataEventCards.first();
  await firstEventCard.locator(homeEvntPage.bookNowButtons).click();
  await evntDetailsPage.bookTicketsNoUpdate(customer.name, customer.email, customer.phone);
}

async function bookingFirstEventMultipleTickets(homeEvntPage, evntDetailsPage, customer, ticketcount) {
  await homeEvntPage.goToEventsPage();
  const firstEventCard = homeEvntPage.dataEventCards.first();
  await expect(firstEventCard, "Data Event Cards Not Visible").toBeVisible();
  await firstEventCard.locator(homeEvntPage.bookNowButtons).click();
  await evntDetailsPage.bookTicketsWithUpdate(customer.name, customer.email, customer.phone, ticketcount)
}

async function goToFirstBookingDetail(myBookingsPage) {
  await myBookingsPage.myBookingsLink.click();
  await expect(myBookingsPage.bookingCards.first(), 'my booking cards are not visible').toBeVisible();

  const firstBooking = myBookingsPage.bookingCards.first();
  const bookingCode = (await myBookingsPage.bookingReference.first().textContent()).trim();
  await firstBooking.locator(myBookingsPage.viewDetailButtons).click();

  return bookingCode;
}

async function validateBookingRefMatches(myBookingsDetailsPage, expectedCode) {
  const actualCode = await myBookingsDetailsPage.getMyBookingDetailsCode();
  expect(actualCode.trim()).toBe(expectedCode.trim());
}


async function checkRefundEligibility(myBookingsDetailsPage) {
  await myBookingsDetailsPage.checkRefundEligibility.click();
  await expect(myBookingsDetailsPage.refundSpinner).toBeVisible();
  await expect(myBookingsDetailsPage.refundSpinner).toBeHidden({ timeout: 6000 });
}

module.exports = {
  bookFirstEventDefaultTicket,
  bookingFirstEventMultipleTickets,
  goToFirstBookingDetail,
  validateBookingRefMatches,
  checkRefundEligibility,
};