//Full Event Booking Flow

/* 

    Simple Rules for Assertion 
    Simple rule:
    ---------------------------------------------------------
    Involves                                   Need await?
    page, locator, DOM element                 ✅ Yes
    Plain JS value (string, number, boolean)   ❌ No
    ---------------------------------------------------------
*/

const {test, expect} = require('@playwright/test');
const { PageObjectManagerFBF } = require("../../pageObjects/FullBookingFlow_EventCreation/pageObjectFBFManager");

// /testData/credentials.js
const { email, password } = require("./testData/credentials");
const { EventsFBFPage } = require('../../pageObjects/FullBookingFlow_EventCreation/eventsFBFPage');

//global values
let webContext;
let eventTitle;

/*
    Step 1 — Login
    - Navigate to /login
    - Fill email field (locate by placeholder you@email.com)
    - Fill password field (locate by label Password)
    - Click the login button (locate by id #login-btn)
    - Assert: link with text Browse Events → is visible (confirms login success)
*/

//for this test i could use a_...spec.js file and storage state json to pass credentials here but its best to 
    //use the username and password from option 2 (store in local file) since the test use is to log in 
    //replicating a normal user flow
    //refer to APPENDIX A at the end of all tests for explanation

test.beforeAll("Successful Log In", async ({ browser }) => {
    try {
        const context = await browser.newContext();
        //1a. Open new page 
            //creates a new tab in the opened browser
        const page = await context.newPage();
        //initiate Page Object MAnager Class now and 
        const pObjManager = new PageObjectManagerFBF(page);

        //give life to the page objects of the login page
        const loginPage =  pObjManager.getLoginPage();

        //navigate to the log in page
        await loginPage.goToLoginPage();

        //use the hardcoded credetials 
        await loginPage.login(email, password);

        const postLoginHomePage = pObjManager.getLoggedInHomePage();

        //verify you are on the home page first with the Home button
        await expect(postLoginHomePage.homeAnchor).toBeVisible();

        //now store the values in storage state for the next test
        //NEW CODE where we use playwright storage state method and store in file
        await context.storageState({ path: 'state.json'});
        
        //Inject the state.json file in a new browser context with the existing storage data from above
        //now any new browser context has all the information it needs to act like a log in
        webContext = await browser.newContext({storageState: 'state.json'});

        console.log("Before All Storage State success");
                
    } catch (error) {
        console.error(error.stack); 
        throw error;  // re-throw so Playwright marks test as FAILED
    } 
})

/*

Step 2 — 
    - Create a new event
    - Navigate to /admin/events
    - Generate a unique event title using Test Event ${Date.now()} — store this in a variable, you will need it throughout the test
    - Fill Title field (locate by id #event-title-input)
    - Fill Description textarea (locate using #admin-event-form textarea)
    - Fill City field (locate by label City)
    - Fill Venue field (locate by label Venue)
    - Fill Event Date & Time field (locate by label Event Date & Time) — use your futureDateValue() helper
    - Fill Price ($) field (locate by label Price ($)) — use any number e.g. 100
    - Fill Total Seats field (locate by label Total Seats) — use 50
    - Click the submit button (locate by id #add-event-btn)
    - Assert: toast message Event created! is visible
*/

test("POST Login - Create a New Event", async ({ page }) => {
    try {

        //direct injection from storage state
        //creatinga. new page using the webContext from .beforeAll with ALL OF THE 
        const page = await webContext.newPage();
        
        //navigate to the URL without using the log in credentials again
        // const adminEventsURL = "https://eventhub.rahulshettyacademy.com/admin/events";
        // await page.goto(adminEventsURL);  //will be able to access

        //initiate Page Object MAnager Class now and assert you are on the right page
        const pObjManager = new PageObjectManagerFBF(page);
        const admEvntPage =  pObjManager.getCreateEventPage();
        await admEvntPage.goToAdminEventsPage();
        await expect(page).toHaveURL(/\/admin\/events/);  //verify url has admin and events in it

        //set all values on page
        eventTitle = "My Event For " + Date.now();
        await admEvntPage.eventTitle.fill(eventTitle); //make the events unique
        console.log(eventTitle);
        await admEvntPage.eventDescription.fill("This event is for true AI users only, newbies need not apply");

        //add defeensive coding to ensure event category is visible before entering
            // .fill takes care of this but for this object type we are using .selectOption
        // Guard: verify option exists before selecting
        await expect(admEvntPage.eventCategory, "Event Category dropdown is NOT visible").toBeVisible();
        await admEvntPage.eventCategory.selectOption({ value: 'Workshop' });
        await admEvntPage.eventCity.fill("San Diego"); 
        await admEvntPage.eventVenue.fill("30 Memorial Ave Avon, Massachussetts 02332"); 
        
        //Event Date time has some data manipulation to return the expected date time format
            //view the setFutureDate method to see the reasoning
        const futureDate = await admEvntPage.setFutureDate(6);
        console.log(futureDate)
        await admEvntPage.eventDateTime.fill(futureDate);  //this returns 2026-06-18T13:58

        await admEvntPage.eventPrice.fill("100");
        await admEvntPage.eventTotalSeats.fill("50");

        // Guard: add Event button is visible before selecting
        await expect(admEvntPage.addEventButton, "Add Event Button is NOT visible").toBeVisible();
        await admEvntPage.addEventButton.click();

        //await for the toast to be seen using expect with guard
        await expect(admEvntPage.succEventCreatedToast, "Success toast did not appear")
            .toBeVisible({ timeout: 10000 });

        console.log("Event Created successfully");
               
        // await page.pause();

    } catch (error) {
        console.error(error.stack);
        throw error;   // re-throw so Playwright marks test as FAILED
    } 
})

/*
    Step 3 — Find the event card and capture seats
    - Navigate to /events
    - Get all event cards (locate by data-testid="event-card")
    - Assert the first card is visible (confirms page loaded)
    - From all cards, filter for the one that contains your event title text
    - Assert the matched card is visible (timeout 5 seconds)
    - Read the seat count text from that card (locate element containing text seat, parse integer from its inner text) — store this as seatsBeforeBooking
*/

test("POST Login - Find the event card and capture seats", async ({page}) => {

    try {
        //direct injection from storage state
        //creatinga. new page using the webContext from .beforeAll with ALL OF THE 
        const page = await webContext.newPage();
            
        //navigate to the URL without using the log in credentials again
        // const adminEventsURL = "https://eventhub.rahulshettyacademy.com/admin/events";
        // await page.goto(adminEventsURL);  //will be able to access

        //initiate Page Object MAnager Class now and assert you are on the right page
        const pObjManager = new PageObjectManagerFBF(page);
        const homeEvntPage =  pObjManager.getEventsHomePage();
        await homeEvntPage.goToEventsPage();
        await expect(page).toHaveURL(/.*events/);  //verify url has events in it

        //assert first card is visible
        await expect(homeEvntPage.dataEvenCards.first(), "First Card is Not Visible Yet").toBeVisible();

        //From all cards, filter for the one that contains your event title text
        const myEventCard = homeEvntPage.dataEvenCards.filter( {hasText : eventTitle} );
        console.log("my event card is " + await myEventCard.textContent());
        /*
            // ❌ Wrong - textContent() returns a Promise, not a locator
            await expect(myEventCard.textContent()).toBeVisible();
            // ❌ Wrong - textContent() returns a Promise, not a locator
            await expect(myEventCard.textContent()).toContain(eventTitle);
        */
        await expect(myEventCard).toBeVisible( {timeout: 5000} );
        await expect(myEventCard).toContainText(eventTitle);

        //Read the seat count text from that card (locate element containing text seat, 
        // parse integer from its inner text) — store this as seatsBeforeBooking
            //TEXT FROM MY EVENT CARD --- my event card is WorkshopMy Event For 1781371468358Fri, 19 Jun30 Memorial Ave Avon, Massachussetts 02332, San Diego$10050 seats availableBook Now
        const cardText = await myEventCard.textContent();
        const seatsCardText = cardText.slice(cardText.indexOf("seats") - 3).trim(); //go 3 back from the s
        const seatsBeforeBooking = parseInt(seatsCardText.slice(0,2));
        console.log(typeof seatsBeforeBooking + " " + seatsBeforeBooking);

        //no need to use await here and if you did
            // ⚠️ This will always pass even if wrong - expect() here is just a JS value, not a Playwright locator
            //await expect(seatsBeforeBooking).toEqual(50);
        expect(seatsBeforeBooking).toBe(50);

    } catch (error) {
        console.error(error.stack);
        throw error;
    }

    

})

//Appendix A

/*
    You have a few options depending on your needs:

    //OPTION 1
    Option 1: Playwright Storage State (Best for auth/session)
    Save the session after account creation and reuse it:
    javascript// At the end of your create account test
    await page.context().storageState({ path: 'storageState.json' });
    Then in your other spec file:
    javascript// otherSpec.js
    const { test } = require('@playwright/test');

    test.use({ storageState: 'storageState.json' }); // reuse session

    test("Use Created Account", async ({ page }) => {
        // user is already logged in with saved session
        await page.goto("https://eventhub.rahulshettyacademy.com/");
    });

    //OPTION 2
    Option 2: Shared Credentials File (Best for hardcoded/reusable credentials)
    Create a testData.js file:
    javascript// testData/credentials.js
    module.exports = {
        email: "joeylorenzo44_7@yahoo.com",
        password: "C@rdionet#1"
    };
    Then import it in any spec:
    javascript// otherSpec.js
    const { email, password } = require('../../testData/credentials');

    test("Login with Created Account", async ({ page }) => {
        await loginPage.login(email, password);
    });

    //OPTION 3
    Option 3: Playwright Global Setup (Best for one-time setup across all tests)
    javascript// global-setup.js
    const { chromium } = require('@playwright/test');

    module.exports = async () => {
        const browser = await chromium.launch();
        const page = await browser.newPage();

        // do your registration flow here...

        await page.context().storageState({ path: 'storageState.json' });
        await browser.close();
    };
    javascript// playwright.config.js
    module.exports = {
        globalSetup: './global-setup.js',
        use: {
            storageState: 'storageState.json' // all tests reuse this
        }
    };

    //SUMMARY
    Which to use?
    ScenarioBest OptionReuse login session (stay logged in)Option 1 or 3Just share email/password across testsOption 2Run registration once for all testsOption 3
*/