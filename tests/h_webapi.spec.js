//user name and password
//testUser63@example.com/Test@1234

const { test, expect, request } = require("@playwright/test");

//global values
let token;
let orderId;

//before all tests run do XXXX below in this block of code and then run test 1,2,n
//To Log in we are using the following API Call
//POST - https://rahulshettyacademy.com/api/ecom/auth/login
//{"userEmail":"testUser63@example.com","userPassword":"Test@1234"}

//api call
const apiLoginURL = "https://rahulshettyacademy.com/api/ecom/auth/login";
const apiOrderURL = "https://rahulshettyacademy.com/api/ecom/order/create-order";
//url payload JSON has a javascript object of property and value
//only the value can be in quotes
const loginPayLoad = {
  userEmail: "testUser63@example.com",
  userPassword: "Test@1234",
};

//create payorder payload
const orderPayLoad = {orders:
    [{country:"Cuba",productOrderedId:"6960eac0c941646b7a8b3e68"}

    ]
}

test.beforeAll(async () => {
    try{
        //api context
        const apiContext = await request.newContext();

        //making api calls on X API Call - NOT page like in web sessions
        const loginResponse = await apiContext.post(apiLoginURL, {
            data: loginPayLoad,
        });

        //need to make sure login response returnes 200 as matching in the UI
        expect(loginResponse.ok()).toBeTruthy();

        //from the response OBJECT (called loginResponseJSON here) we need to grab the token value
        const loginResponseJSON = await loginResponse.json();
        token = await loginResponseJSON.token;

        //log the token
        console.log(token);
    } catch (error) {
        console.error(`❌ Failed to inject token to URL: ${token}`);
        console.error(error.stack);
        throw error;
  }
  
});

//before each test case do XXXX below in this block of code
test.beforeEach(() => {});

//browser opens one instance of a session within a browser ensuring all test sessions are in their own browser session
test("Using API Session Token - ByPass Login to Navigate to Any URL", async ({page,browser}) => {

    try {
        //no need to go to main home page URL and log in anymore, the test.beforeAll will do it
        //await goToURL(page, homePageURL);

        //inject javascript expressions in local storage
        await injectLogin(page);

        //go to the the URL you want
        const bypassLoginURL = "https://rahulshettyacademy.com/client/";
        await goToURL(page, bypassLoginURL);

        //pause to see the page, too fast
        await page.pause();
    } catch (error) {
        console.error(`❌ Failed to bypass login with ${token} and navigate to URL: ${bypassLoginURL}`);
        console.error(error.stack);
        throw error;
    }
   
});


//imagine you just wanted to do a test where you place an order or just add an item to cart test, why do we need to log in every time? This adds MORE time to our script, time we may not have and saving time allows us to produce a better output. 

/*
  Just like in a test case you write manually there are pre-requisites (such as ability to log in as user X in Stack Officials)
  For this tet case the pre-requisites are to have an existing order to be able to look up
    //the one we know about from database or UI or some other source is 698d055648d62064b2fee2df
*/
test("Using API Session Token - ByPass Login to Lookup Existing Order", async ({page}) => {

    try {
        //inject javascript expressions in local storage
        await injectLogin(page);

        //go to url orders page
        const ordersURL = "https://rahulshettyacademy.com/client/#/dashboard/myorders";
        await goToURL(page, ordersURL);

        const prevOrderID = '698d055648d62064b2fee2df';

        const yourOrderList = page.locator("th[scope='row']");
        //need to wiat for the values to be visible before grabbing them
        //A good rule of thumb is: If a method returns an Array immediately, you usually need to await a visibility check first.
        await expect(yourOrderList.first()).toBeVisible();
        const finalOrderList = await yourOrderList.allTextContents();
        console.log(finalOrderList);

        //assert order number is in table
        expect(finalOrderList).toContain(prevOrderID);

        //find each row locator and look for the order id and click the associated button
        await page.locator("tr", { hasText: prevOrderID }).getByRole("button", { name: "View" }).click();

        await page.pause();


        //place an order
    } catch (error) {
        //console.error(`❌ Failed to bypass login with ${token} and navigate to URL: ${ordersURL}`);
        console.error(error.stack);
        throw error;
    }
 
});



//imagine you dont have a previous existing order but need one as your pre-req
//well you can see if there is an API call which will return an order id immediately so YOU DONT have to go through all the API steps
//it turns out there is when viewing the NETWORK tab
    //{"orders":[{"country":"United Kingdom","productOrderedId":"6960eac0c941646b7a8b3e68"}]}
test.only("Using API Session Token - Create Order with API Call Then Validate It", async ({page}) => {

    try {

        //inject javascript expressions in local storage
            //get token from here
        await injectLogin(page);

        //grab the api response from the API call and retrieve order id number created
        const responseBody = await createAPIRequest(page, apiOrderURL, orderPayLoad, token);
        //notice how the response body values are returned in array format so you need to specify index value
        orderId = responseBody.orders[0];
        console.log(orderId);

        const ordersURL = "https://rahulshettyacademy.com/client/#/dashboard/myorders";
        await goToURL(page, ordersURL);

        const finalOrderList = await returnOrderList(page);
        
        //assert order number is in table
        expect(finalOrderList).toContain(orderId);

        //find each row locator and look for the order id and click the associated button
        await page.locator("tr", { hasText: orderId }).getByRole("button", { name: "View" }).click();

        await page.pause();


        //place an order
    } catch (error) {
        //console.error(`❌ Failed to bypass login with ${token} and navigate to URL: ${ordersURL}`);
        console.error(error.stack);
        throw error;
    }
 
});

//inject login
async function injectLogin(page) {
    try {
        //inject javascript expressions in local storage
        await page.addInitScript((value) => {
        window.localStorage.setItem("token", value);
        }, token);
    } catch (error) {
        console.error(`❌ Failed to inject token to URL: ${token}`);
        console.error(error.stack);
        throw error;
    }
}

//go to any url via bypassing login above (MUST COME AFTER)
async function goToURL(page, url) {
    try {
        await page.goto(url);
    } catch (error) {
        console.error(`❌ Failed to navigate to URL: ${url}`);
        throw error;
    }
}

//create new api request
async function createAPIRequest(page,apiURL, dataPayload, authorization) {

    const apiContext = await request.newContext();

    //making api calls on X API Call - NOT page like in web sessions
        //we copy the structure of the UI and implement it programatically
    const loginResponse = await apiContext.post(apiURL, {
        data: dataPayload,
        headers: {
            'Content-Type': 'application/json',
            // Add headers as needed where in this case if you view the API the token is in the headers
            'Authorization': authorization 
        }
    });

    const responseBody = await loginResponse.json();
    console.log(responseBody);
    return responseBody;

}

//find order in list
async function returnOrderList(page) {

    const yourOrderList = page.locator("th[scope='row']");
    //need to wiat for the values to be visible before grabbing them
    //A good rule of thumb is: If a method returns an Array immediately, you usually need to await a visibility check first.
    await expect(yourOrderList.first()).toBeVisible();
    const finalOrderList = await yourOrderList.allTextContents();
    console.log(finalOrderList);

    return finalOrderList;
}
 