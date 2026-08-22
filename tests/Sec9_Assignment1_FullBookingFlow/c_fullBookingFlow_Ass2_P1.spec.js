//Using a helper function for test.beforeAll so dont need to copy the same code from b_fullBookingFlow....spec.js file
//Making .beforeAll reuseable so all .spec.js files going forward can create all of the page object files globally and resue them for all
//all tests following


/* 

    Simple Rules for Assertion 
    Simple rule:
    ---------------------------------------------------------
    Involves                                   Need await?
    page, locator, DOM element                 ✅ Yes
    Plain JS value (string, number, boolean)   ❌ No
    ---------------------------------------------------------
*/


/*
    For identifying objects on a page best to use playwrights built it method whenever you can

    1. getByRole()      → best (mimics how users/assistive tech see the page)
    2. getByText()      → good for visible text content
    3. getByLabel()     → great for form fields
    4. getByPlaceholder() → good for inputs
    5. getByTestId()    → great when role/text isn't reliable or unique
    6. CSS/XPath (#id, .class) → last resort

*/


const {test, expect} = require('@playwright/test');
const { loginAndInitPageObjects } = require('../../pageObjects/FullBookingFlow_EventCreation/helpers/loginAndInitPageObjects');
const { email, password, baseURL } = require("./testData/credentials");

//global values — same as before, unchanged
let webContext;
let page;
let pObjManager;
let loginPage;
let postLoginHomePage;
let admEvntPage;
let homeEvntPage;
let evntDetailsPage;
let myBookingsPage;
let myBookingsDetailsPage;
let eventTitle;
let fullEventURL;
let bookingReference;
let myEventCard;
let seatsBeforeBooking;
let defaultTicketCount;
let myBookingFirstEventCode;

/*
    Setup
    - BASE_URL = https://eventhub.rahulshettyacademy.com
    - Credentials: Use your own credentials
    - Write a reusable loginAndGoToBooking(page) helper that logs in and confirms the Browse Events → link is visible
        Test 1 — Single ticket booking is eligible for refund
        Step 1 — Login
    - Call your login helper
*/

test.beforeAll("Step 1 - Successful Log In Using Reusable loginAndInitPageObjects(page) helper", async ({ browser }) => {
    try {
        // ✅ Destructure directly into your existing globals — no repeated lines
        /*
            This says: "Take someObject, and for each property name listed, pull out the value and assign it to a variable with that same 
            name." It's shorthand for writing all of this manually:

                BASICALL YOU DONT WANT TO DO THIS
                const result = await loginAndInitPageObjects(browser, email, password);
                webContext = result.webContext;
                page = result.page;
                pObjManager = result.pObjManager;
                loginPage = result.loginPage;
                postLoginHomePage = result.postLoginHomePage;
                admEvntPage = result.admEvntPage;
                homeEvntPage = result.homeEvntPage;
                evntDetailsPage = result.evntDetailsPage;
                myBookingsPage = result.myBookingsPage;

            Why the parentheses ( ) are required
            javascript// ❌ This breaks
            { webContext, page } = await loginAndInitPageObjects(...);

            // ✅ This works
            ({ webContext, page } = await loginAndInitPageObjects(...));
            When a JS statement starts with {, the parser assumes you're opening a code block (like an if block or function body), 
            not an object pattern. Wrapping the whole expression in ( ) tells JavaScript "this is an expression AND not a block" 
            and THUS so it correctly parses it as a destructuring assignment.

            Since webContext, page, etc. were already declared with let at the top of your file as globals, you don't redeclare them 
            — you just assign new values into the same variables so every test in the file can see the updated values.
        */
        ({ //these must match what is in loginAndInitPageObjects
            webContext,
            page,
            pObjManager,
            loginPage,
            postLoginHomePage,
            admEvntPage,
            homeEvntPage,
            evntDetailsPage,
            myBookingsPage,
            myBookingsDetailsPage
        } = await loginAndInitPageObjects(browser, email, password));

        console.log("Before All Storage State success");

    } catch (error) {
        console.error(error.stack);
        throw error;
    }
})

test.afterAll(async () => {
    await page.close();
});


/*
    Step 2 — Book first event with 1 ticket (default)
    - Navigate to /events
    - Click Book Now on the very first event card (locate data-testid="event-card" → first → data-testid="book-now-btn")
    - Fill Full Name, Email (your email), Phone
    - Click confirm button (.confirm-booking-btn)
*/
test("Step 2 - POST Login - Book first event in list with 1 ticket ", async () => {
    try {

        await homeEvntPage.goToEventsPage();
        await expect(page).toHaveURL(baseURL + "/events");

        await expect(homeEvntPage.dataEventCards.first(), "Data Event Cards Not Visible").toBeVisible()
        const firstEventCard = homeEvntPage.dataEventCards.first();  //only look at first event card
        console.log(await firstEventCard.textContent());  //obtain text content

        //click associated book now button with first card
        await firstEventCard.locator(homeEvntPage.bookNowButtons).click();
        
        //book one ticket count with no updates to ticket count
        await evntDetailsPage.bookTicketsNoUpdate("Random Me", "test@test.com", "584-874-5712");
        
        //await page.pause();
        
        console.log("Filled in Booking Form successfully");

       
    } catch (error) {
        console.error(error.stack);
        throw error;
    }
})


/*
    Step 3 — Navigate to booking detail
    - Click View My Bookings link
    - Assert URL is /bookings
    - Click the first View Details link
    - Assert: text Booking Information is visible on the page

*/
test("Step 3 - POST Login - Navigate to booking detail ", async () => {
    try {

        await myBookingsPage.myBookingsLink.click();
        await expect(page).toHaveURL(baseURL + "/bookings");

        //the first link in my bookings should always be my event
        await expect(myBookingsPage.bookingCards.first(), "my booking cards are not visible").toBeVisible();
        const myBookingFirstEvent = await myBookingsPage.bookingCards.first();
        
        console.log(await myBookingFirstEvent.textContent());

        //grab my Event booking code from myBookingsPage and click associated view details button with the card
        myBookingFirstEventCode = await myBookingsPage.bookingReference.first().textContent();
        console.log("My Booking Event First Event Code is " + myBookingFirstEventCode);
        await myBookingFirstEvent.locator(myBookingsPage.viewDetailButtons).click();
  
              
    } catch (error) {
        console.error(error.stack);
        throw error;
    }
})

/*
    Step 4 — Validate booking ref
    - Read booking ref from page
    - Read event title from h1
    - Assert validation : "first character of booking ref equals first character of event title"
*/
test("Step 4 - POST Login - Validate booking ref", async () => {

    try {
        //grab booking code from myBookingDetailsPage
        const myEventBookingDetailsCode = await myBookingsDetailsPage.getMyBookingDetailsCode();
        console.log("My Event Details Event Code is  " + myEventBookingDetailsCode);

        //assert booking code from Step 3 before clicking view details button matches the same 
        expect(myBookingFirstEventCode.trim()).toBe(myEventBookingDetailsCode.trim());
        
  
    } catch (error) {
        console.error(error.stack);
        throw error;
    }
})
 
/*
    Step 5 — Check refund eligibility
    - Click the Check Refund Eligibility button
    - Assert: spinner element (#refund-spinner) is immediately visible
    - Assert: spinner is no longer visible within 6 seconds
*/

test("Step 5 - POST Login - Check refund eligibility", async () => {

    try {

        await myBookingsDetailsPage.checkRefundEligibility.click();
        await expect(myBookingsDetailsPage.refundSpinner).toBeVisible();
        await expect(myBookingsDetailsPage.refundSpinner).toBeHidden({ timeout: 6000 });
        
    } catch (error) {
        console.error(error.stack);
        throw error;
    }
})

/*
    Step 6 — Validate result
    - Locate result element by id #refund-result
    - Assert it is visible
    - Assert it contains text Eligible for refund
    - Assert it contains text Single-ticket bookings qualify for a full refund
*/

test("Step 6 - POST Login - Validate result", async () => {

    try {

        await expect(myBookingsDetailsPage.refundEligiblityStatus)
            .toContainText('Eligible for refund. Single-ticket bookings qualify for a full refund.');
        
    } catch (error) {
        console.error(error.stack);
        throw error;
    }
})


 


