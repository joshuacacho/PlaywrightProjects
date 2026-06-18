// Full Event Booking Flow

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
const { PageObjectManagerFBF } = require("../../pageObjects/FullBookingFlow_EventCreation/pageObjectFBFManager");

// /testData/credentials.js
const { email, password, baseURL } = require("./testData/credentials");

//global values
let webContext; //global context
let page; //global page
let pObjManager;  //pageObject
let loginPage;  //pageObject
let postLoginHomePage;  //pageObject
let admEvntPage;  //pageObject
let homeEvntPage;  //pageObject
let evntDetailsPage;  //pageObject
let myBookingsPage;
let eventTitle;  //globall variable
let fullEventURL;  //globall variable
let bookingReference;  //globall variable
let myEventCard;  //globall variable
let seatsBeforeBooking;  //blobal variable
let defaultTicketCount; //global variable

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

test.beforeAll("Step 1 - Successful Log In", async ({ browser }) => {
    try {
        const context = await browser.newContext();
        //1a. Open new page 
            //creates a new tab in the opened browser
        // use global page defined above to so you dont have to create a new page instance in each test AFTER
            //REFER TO APPENDIX B as to WHEN and WHY To use this approach or the one below
            //i.e dont put const page = await context.newPage(). 
        page = await context.newPage();  

        //initiate Page Object MAnager Class now and 
        pObjManager = new PageObjectManagerFBF(page);

        //give life to the page objects of the login page
        loginPage =  pObjManager.getLoginPage();

        //navigate to the log in page
        await loginPage.goToLoginPage();

        //use the hardcoded credetials 
        await loginPage.login(email, password);

        postLoginHomePage = pObjManager.getLoggedInHomePage();

        //verify you are on the home page first with the Home button
        await expect(postLoginHomePage.homeAnchor).toBeVisible();

        //now store the values in storage state for the next test
        //NEW CODE where we use playwright storage state method and store in file
        await context.storageState({ path: 'state.json'});
        
        //Inject the state.json file in a new browser context with the existing storage data from above
        //now any new browser context has all the information it needs to act like a log in
        webContext = await browser.newContext({storageState: 'state.json'});

        // ⚠️ CRITICAL: reassign page AND pObjManager to the NEW context
        page = await webContext.newPage();  // page #2 (the one tests will use)
        pObjManager = new PageObjectManagerFBF(page);  // MUST rebind to page #2

        // Now initialize all page objects ONCE
        admEvntPage = pObjManager.getCreateEventPage();
        homeEvntPage = pObjManager.getEventsHomePage();
        evntDetailsPage = pObjManager.getEventDetailsPage();
        myBookingsPage = pObjManager.getMyBookingsPage();

        console.log("Before All Storage State success");
                
    } catch (error) {
        console.error(error.stack); 
        throw error;  // re-throw so Playwright marks test as FAILED
    } 


    /*
        can you expand on this please, the solution works but can you break down the explanation 
            //Most likely cause: Your page objects (admEvntPage, homeEvntPage, etc.) were created 
            //using the first page (before webContext reassignment), so they're holding a reference to the old/closed page AND
            //not the new global page.

        1:07 PM
        Here's the breakdown:

        1. JavaScript objects hold references, not live links

        When you write pObjManager = new PageObjectManagerFBF(page), the constructor stores whatever page points to at that exact moment — usually as this.page = page. It's a snapshot, not a connection that automatically updates if the outer page variable later gets reassigned.

        javascript
        class PageObjectManagerFBF {
            constructor(page) {
                this.page = page; // locked in — a copy of the reference, not a live pointer
            }
        }
        2. What actually happened in your beforeAll

        javascript
        page = await context.newPage();           // page → Tab A
        pObjManager = new PageObjectManagerFBF(page); // pObjManager.page → Tab A (locked in)

        // ... login happens on Tab A ...

        webContext = await browser.newContext({ storageState: 'state.json' });
        page = await webContext.newPage();         // page variable now → Tab B
        At this point, the outer variable page points to Tab B. But pObjManager was built back when page meant Tab A — it never got the memo. It's still internally wired to Tab A.

        3. Why every page object built from pObjManager failed

        javascript
        admEvntPage = pObjManager.getCreateEventPage();
        homeEvntPage = pObjManager.getEventsHomePage();
        These methods do something like return new CreateEventPage(this.page) — and this.page inside pObjManager is still Tab A. So every page object you create afterward is silently bound to the wrong tab.

        4. Why the error showed about:blank

        Tab A was the original tab used only for login. After beforeAll finished, nothing navigated Tab A anywhere else — it just sat there, or possibly got closed/abandoned. Meanwhile your test assertions check the outer page variable (Tab B, which is real and on the right URL eventually) — but the actual navigation commands (admEvntPage.goToAdminEventsPage()) were firing on Tab A, which never moved from its blank/idle state.

        That's the mismatch: assertions checking one tab, navigation happening on another.

        5. Why the fix worked

        javascript
        page = await webContext.newPage();              // page → Tab B
        pObjManager = new PageObjectManagerFBF(page);    // rebuild pObjManager NOW, while page → Tab B
        admEvntPage = pObjManager.getCreateEventPage();  // now correctly bound to Tab B
        By recreating pObjManager after reassigning page, you force it to capture the new reference at construction time. Every page object built afterward inherits the correct, current tab.

        The core lesson: constructors capture values at the moment they run — they don't track variables over time. If a dependency changes, anything built from it before the change is stale and needs to be rebuilt.
    */
})

test.afterAll(async () => {
    //Clean up and close the page instance when all tests finish
    await page.close();
  });

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

test("Step 2 - POST Login - Create a New Event", async () => {
    try {
         // use global page defined above to so you dont have to create a new page instance in each test AFTER
            //REFER TO APPENDIX B as to WHEN and WHY To use this approach or the one below
            //i.e dont put const page = await context.newPage(). 
        //const page = await webContext.newPage();
        
        //navigate to the URL without using the log in credentials again
        // const adminEventsURL = "https://eventhub.rahulshettyacademy.com/admin/events";
        // await page.goto(adminEventsURL);  //will be able to access

        
        await admEvntPage.goToAdminEventsPage();
        await expect(page).toHaveURL(baseURL + "/admin/events");  //verify url has admin and events in it

        eventTitle = await admEvntPage.eventTitleRandom();

        admEvntPage.createEventFull(eventTitle, "This Event is for serious applicants only",
            'Workshop', "Avon", "Workshop at the Dam 30 Memorial Ave Avon, MA 02332", 6, "100", "50");

        //await for the toast to be seen using expect with guard
        await expect(admEvntPage.succEventCreatedToast, "Success toast did not appear")
            .toBeVisible({ timeout: 10000 });
    
        console.log("Event Created successfully");

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

test("Step 3 - POST Login - Find the event card and capture seats", async () => {

    try {

        // use global page defined above to so you dont have to create a new page instance in each test AFTER
            //REFER TO APPENDIX B as to WHEN and WHY To use this approach or the one below
            //i.e dont put const page = await context.newPage(). 
        //const page = await webContext.newPage();
       
        await homeEvntPage.goToMyEventsPageLink();
        await expect(page).toHaveURL(baseURL + "/events");  //verify url has events in it

        //assert first card is visible
        await expect(homeEvntPage.dataEventCards.first(), "First Card is Not Visible Yet").toBeVisible();

        //From all cards, filter for the one that contains your event title text
        myEventCard = homeEvntPage.dataEventCards.filter( {hasText : eventTitle} );
        console.log("My event card text content is " + await myEventCard.textContent());
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
        const seatsCardText = cardText.slice(cardText.indexOf("seats") - 3).trim(); //go 3 back from the FIRST s 50 seats
        seatsBeforeBooking = parseInt(seatsCardText.slice(0,2)); //50
        console.log("Type of seats before booking object type + numerical value " + 
            typeof seatsBeforeBooking + " " + seatsBeforeBooking);

        //no need to use await here and if you did
            // ⚠️ This will always pass even if wrong - expect() here is just a JS value, not a Playwright locator
            //await expect(seatsBeforeBooking).toEqual(50);
        expect(seatsBeforeBooking).toBe(50);

        //await page.pause();

        console.log("Found Event and Captures Seats successfully");
    } catch (error) {
        console.error(error.stack);
        throw error;
    }

})



/* 
    Step 4 — Start booking
    - On the matched event card, click the Book Now button (locate by data-testid="book-now-btn" inside the card)
*/

test("Step 4 - POST Login - Start Booking - Select Book Now Button", async () => {

      try {
        // use global page defined above to so you dont have to create a new page instance in each test AFTER
            //REFER TO APPENDIX B as to WHEN and WHY To use this approach or the one below
            //i.e dont put const page = await context.newPage(). 
        //const page = await webContext.newPage();

       
        await homeEvntPage.goToEventsPage();
        await expect(page).toHaveURL(baseURL + "/events");  //verify url has events in it

        //From all cards, filter for the one that contains your event title text
        //assert first card is visible
        await expect(homeEvntPage.dataEventCards.first(), "First Card is Not Visible Yet").toBeVisible();

        //click the book now button for the associated event title
        myEventCard = homeEvntPage.dataEventCards.filter( {hasText : eventTitle} );

        await myEventCard.locator(homeEvntPage.bookNowButtons).click();

        console.log("Started Booking successfully");

      } catch (error) {
        console.error(error.stack);
        throw error;
      }
})


/*
    Step 5 — Fill booking form
    - Assert: element with id #ticket-count has text 1 (default quantity)
    - Fill Full Name (locate by label Full Name)
    - Fill Email (locate by id #customer-email)
    - Fill Phone (locate by placeholder +91 98765 43210)
    - Click the confirm button (locate by CSS class .confirm-booking-btn)
*/

test("Step 5 - POST Login - Fill In the Booking Form", async () => {

      try {
        //direct injection from storage state
        //creatinga. new page using the webContext from .beforeAll with ALL OF THE 
        //const page = await webContext.newPage();


        //hover over eventTitle Link and construct FULL URL for next text
        // Hover over the link inside the card by locator eventURLHover violated a strickt mode violation
            //in the error the below observation was given from playwright to use
            //aka getByRole('link', { name: 'My Event For 1781558010437' })

        const eventLink = myEventCard.getByRole('link', { name: eventTitle });
        await eventLink.click();
        
        /* if you wanted to consturct the url entirely then go there
            // await eventLink.hover();
            // const partialEventURL = await eventLink.getAttribute('href');  ///events/<num>
            // console.log("Partial Event URL is " + partialEventURL);

            // fullEventURL = baseURL + partialEventURL;
            // console.log("Full Event URL is: " + fullEventURL);
        
            // //navigate to the constructed fullEventURL
            // await page.goto(fullEventURL);
        */

        //assert ticket count 1
        defaultTicketCount = await evntDetailsPage.getTicketCount();
        console.log("Default ticket count " + defaultTicketCount);
        expect(defaultTicketCount, "Ticket Count is NOT 1").toBe(1);
        
        await evntDetailsPage.bookTicketsNoUpdate("Random Me", "test@test.com", "584-874-5712");

        //await page.pause();

        console.log("Filled in Booking Form successfully");

      } catch (error) {
        console.error(error.stack);
        throw error;
      }
})


/*
    Step 6 — Verify booking confirmation
    - Locate the booking reference element (locate by CSS class .booking-ref, take .first())
    - Assert it is visible
    - Read its inner text, trim it — store as bookingRef
*/

test("Step 6 - POST Login - Verify Booking Information ", async () => {

    try {
        //obtain booking reference for later
        //assertion if value is visible after creating is done in the getBookingReference method
        bookingReference = await evntDetailsPage.getBookingReference(); 
        console.log("Booking reference is " + bookingReference);


        console.log("Verified Booking Information successfully");
    } catch (error) {
        console.error(error.stack);
        throw error;
    }
    
})


/*
    Step 7 — Verify in My Bookings
    - Click the link View My Bookings
    - Assert: URL is BASE_URL/bookings
    - Get all booking cards (locate by id #booking-card)
    - Assert the first booking card is visible
    - Filter booking cards for the one that contains an element with class .booking-ref matching your bookingRef text
    - Assert that matched card is visible
    - Assert that matched card contains your eventTitle text
*/


test("Step 7 - POST Login - Verify in My Bookings", async () => {

    try{ 

        await myBookingsPage.goToMyBookingsPage();
        await expect(page).toHaveURL(baseURL + "/bookings");  //verify url has admin and events in it

        //assert first booking card is visible
        await expect(myBookingsPage.bookingCards.first(), "Booking Card Not Visbile").toBeVisible();

        //Filter booking cards for the one that contains an element with class .booking-ref matching your bookingRef text
        const myBookRef =  myBookingsPage.bookingCards.filter( { hasText : bookingReference } );
        const myBookRefText = await myBookRef.locator(".booking-ref").textContent();
        console.log("POST booking creation - my book referecene text " + myBookRefText);
        await expect(myBookRef).toBeVisible();
        expect(myBookRefText).toBe(bookingReference);

        console.log("Verified My Booking Information successfully");

    } catch (error) {
        console.error(error);
        throw error;
    }

})


/*
    Step 8 — Verify seat reduction
    - Navigate back to /events
    - Assert the first event card is visible
    - Filter cards again using hasText: eventTitle
    - Assert the card is visible
    - Read the seat count text again (same as Step 3) — store as seatsAfterBooking
    - Assert: seatsAfterBooking === seatsBeforeBooking - 1
*/


test("Step 8 - POST Login - Verify seat reduction", async () => {

    try {

        //the below test case was erroring out before due to stale cache, in the UI it showed 49 but 50 kept being returned
        //REMEMBER if you encouter this to 
            //Navigate → Confirm URL → Reload (GET FRESH DATA FROM SERVER + REMOVE STALE CACHE) → Assert fresh content

        await homeEvntPage.goToMyEventsPageLink();
        await expect(page).toHaveURL(baseURL + "/events"); // ✅ wait for navigation first
        await page.reload(); // ✅ force fresh data from server

        await expect(homeEvntPage.dataEventCards.first(), "Data Event Cards Not Visible").toBeVisible()

        console.log("POST event creation - my event card is " + await myEventCard.textContent());
        await expect(myEventCard).toBeVisible();

        const seatsAfterBookingText = await myEventCard.getByText('seats available').textContent();
        console.log("POST event creation - seats after booking text " + seatsAfterBookingText);
        const seatsAfterBooking = parseInt(seatsAfterBookingText);  //will remove all string words and return number
        console.log("POST event creation - seats after booking " + seatsAfterBooking);

        expect(seatsAfterBooking).toBe(seatsBeforeBooking-defaultTicketCount);

        console.log("Verified Seat Reduction successfully");

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



/*
    Appendix B - why you would use the below approach when using SHARED DATA across multiple tests

    Looking at your code, each test does await webContext.newPage() which opens a new tab every time. You need to share a single page instance across all tests.
    Fix — declare page globally and reuse it:
    javascript//global values
    let webContext;
    let eventTitle;
    let fullEventURL;
    let bookingReference;
    let page; // ADD THIS
    Then in beforeAll, assign it globally:
    javascripttest.beforeAll("Step 1 - Successful Log In", async ({ browser }) => {
        try {
            const context = await browser.newContext();
            page = await context.newPage(); // REMOVE const — use global
            
            // ... rest of login code ...

            await context.storageState({ path: 'state.json' });
            webContext = await browser.newContext({ storageState: 'state.json' });
            
            // CREATE the shared page here once
            page = await webContext.newPage(); // reuse this across all tests
            
        } catch (error) {
            console.error(error.stack);
            throw error;
        }
    })
    Then in every test, remove const page = await webContext.newPage() and just use the global page:
    javascripttest("Step 2 - POST Login - Create a New Event", async () => {
        try {
            // ❌ REMOVE THIS LINE from every test
            // const page = await webContext.newPage();

            // ✅ Just use the global page directly
            const pObjManager = new PageObjectManagerFBF(page);
            // ... rest of test
        }
    })
    And your afterAll will work correctly now too:
    javascripttest.afterAll(async () => {
        await page.close(); // no longer throws — page is global
    });


    REASONING WHY

    Exactly! This is a key pattern for end-to-end flows where tests are sequential and depend on each other.
    Quick summary of what you learned:
    javascript// ✅ Global variables = shared state across all tests
    let page;          // one tab, reused everywhere
    let webContext;    // one auth session
    let eventTitle;    // created in Step 2, used in Steps 3, 4, 5
    let fullEventURL;  // captured in Step 4, used in Step 5
    let bookingReference; // captured in Step 5, used in Step 6
    The pattern works because:

    beforeAll runs once — sets up auth + opens one page
    Each test shares the same page instance — no new tabs
    Global let variables act as a pipeline passing data from one test to the next
    afterAll cleans up once at the end

    This mirrors a real user flow — one browser, one session, navigating from step to step, which is exactly what E2E testing should replicate.
    As your test suite grows you'll find this pattern especially useful for flows like:

    Login → Create → Find → Book → Confirm → Verify
    Register → Onboard → Purchase → Receipt → Logout

    Good luck with Step 6! 🎯


    EXTRA RULES WHERE YOU MIGHT WANT TO SEPARATE SHARED TEST vs INDEPENDENT TESTS

    Rule of thumb:

    Scenario                           Approach
    ---------------------------------------------------------------
    Sequential E2E flow (your case)    Shared page — one tab
    Isolated independent tests         New page per test
    Multi-user interaction             New page per user
    Popups / OAuth                     context.waitForEvent('page')
    Real time / WebSocket              Multiple tabs same context
    ---------------------------------------------------------------

*/
