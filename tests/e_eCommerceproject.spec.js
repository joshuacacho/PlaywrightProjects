//user name and password
//testUser63@example.com/Test@1234

const { test, expect } = require("@playwright/test");

const homePageURL = "https://rahulshettyacademy.com/client/#/auth/login";
let productText = [];
let randomProduct = "";
const creditCardNumber = "4542 9931 9292 2255";

test("UI - Login to E-Commerce Application", async ({ page }) => {

try{
  //navigate to url
  await goToURL(page, homePageURL);

  //fill in credentials to log in
  await login(page, "testUser63@example.com", "Test@1234");

  //assert successful login by verifying url goes to the client dashboard
  await expect(page).toHaveURL(/.*client\/#\/dashboard/);

  //add dynamic item to cart
  //in the future we would just put the item we wanted to add, so it would be something like (page, item)
  await addItemToCart(page);

  //navigaete to cart page and assert url is correct
  navigateToURL(
    page,
    "[routerlink='/dashboard/cart']",
    /.*client\/#\/dashboard\/cart/,
  );

  //need to wait for the next page to load the cart items
  const cartItemText = await page.locator(".infoWrap h3").textContent();
  console.log("Cart Item Text: " + cartItemText.trim());

  expect(cartItemText.trim()).toEqual(productText[randomProduct]);

  //click Checkout button
  const checkOutButton = page.locator("button").filter({ hasText: "Checkout" });
  await checkOutButton.click();

  //assert correct page loaded
  await expect(page).toHaveURL(/.*client\/#\/dashboard\/order/);

  await page.waitForSelector(".payment__types");

  //MOVE TO async function after creating
  //when entering values in 01 for instance playwright sees it as a problem
  //The error "Octal literals are not allowed. Use the syntax '0o1'.ts(1121)"
  //So instead of value being let value = 0755; which will throw an error and can be fixed by let value = 0o755;
  checkOutOrderDetails(
    page,
    "Credit Card",
    creditCardNumber,
    "01",
    "15",
    "843",
    "Automation Test Card",
    "rahulshettyacademy",
  ); // "01", "05", "843", "Automation CC", "rahulshettyacademy")

  const shipData = shippingInformation(page, "testUser63@example.com", "United States");

  //click Place Order button
  const placeOrderButton = page.locator(".action__submit");
  await placeOrderButton.click();

  //copy order link to assert on order history page
  //assert correct page loaded
  await expect(page).toHaveURL(/.*client\/#\/dashboard\/thanks/);
  const orderNumber = await page.locator("label[class='ng-star-inserted']").textContent();

  //The regular expression /\|/g is used to find and match all occurrences of the pipe character (|) within a string. 
  let ordNumWithoutPipes = orderNumber.replace(/\|/g, ""); //regex to remove pipes
  let finalOrderNum = ordNumWithoutPipes.trim(); //trim white spaces
  console.log(finalOrderNum); //example output - 69864173c941646b7adaae4d

  const orderHistLink = page.locator("label[routerlink='/dashboard/myorders']");
  await orderHistLink.click();

  //verify my orders page loaded and aseert order number is in the list
  await expect(page).toHaveURL(/.*client\/#\/dashboard\/myorders/);
  const yourOrderList = page.locator("th[scope='row']");
  //need to wiat for the values to be visible before grabbing them
  //A good rule of thumb is: If a method returns an Array immediately, you usually need to await a visibility check first.
  await expect(yourOrderList.first()).toBeVisible();
  const finalOrderList = await yourOrderList.allTextContents();
  console.log(finalOrderList);

  //assert oder number is in table
  expect(finalOrderList).toContain(finalOrderNum);

  //select the associated view button to view the order details just created
    //thank you, i learned something new, so by putting the locator("tr") we are just examining all rows that match our targetViewOrder then clicking on the associated button
        //Exactly! You’ve got the logic perfectly.
        // When you use page.locator('tr', { hasText: targetOrderId }), Playwright performs a two-step search:
        // Scope: It scans every <tr> (table row) on the page.
        // Filter: It ignores every row except the one that contains your specific Order ID string.
        // Once Playwright has "locked on" to that specific row, any further commands (like .getByRole('button')) are restricted only to that row. It won't look at the rest of the table.

    //to note If your website doesn't use a table (tr), you can swap 'tr' for any container that holds both the ID and the button, such as a 'div.order-card' or an 'li'.
    //for numbers example - // Ensures it matches the exact ID and not just "part" of a longer string
    //await page.locator('tr', { has: page.locator('text', { hasText: /^69864ef...$/ }) })
  await page.locator("tr", { hasText: finalOrderNum }).getByRole("button", { name: "View" }).click();

  //assert the following
    /*Verify you are on the right page and that the following matches
        Order id
        Delivery address (user email used to log in)
        Country that was previously selected
        Product name
    */
  
    //Order Id
    const myOrderDetllNum = await page.locator(".col-text").textContent();
    //console.log(myOrderDetllNum);
    expect(finalOrderNum).toEqual(myOrderDetllNum);

    //Billing Address email
        //trim and remove white spaces before comparison
    const billAddEmail = (await page.locator("div.address p:nth-of-type(1)").allTextContents()).map(email => email.trim());
    const billAddEmailCount = billAddEmail.length;
    expect(billAddEmail).toContain((await shipData).email);
    expect(billAddEmailCount).toEqual(2); //should appear twice for billing and delivery address

    //Billing Address Country
        //trim and remove white spaces before comparison
        //remove Country - from the array to only contain the country typed in by the user
    const billAddCountry = (await page.locator("div.address p:nth-of-type(2)").allTextContents()).map(country => country.trim());
    const countryOnlyArray = billAddCountry.map(item => item.replace("Country - ", ""));  //remove Country - to keep United Staate
    const billAddCountryCount = billAddCountry.length;
    expect(countryOnlyArray).toContain((await shipData).countryToSelect);
    expect(billAddCountryCount).toEqual(2); //should appear twice for billing and delivery address

  //you can record from here if you want
  //await page.pause();
  
} catch(error) {
    console.error(`❌ Failed test: ` + error.stack);
    throw error;
}
  
});

//helper function for navigating to any page
async function goToURL(page, url) {
  try {
    await page.goto(url);
  } catch (error) {
    console.error(`❌ Failed to navigate to URL: ${url}`);
    throw error;
  }
}

//helper function for logging in
async function login(page, email, password) {
  try {
    await page.locator("#userEmail").fill(email);
    await page.locator("#userPassword").fill(password);
    await page.locator("#login").click();
  } catch (error) {
    console.error("❌ Login failed for user:", email);
    throw error;
  }
}

//helper function to navigate to url from within any page and aseer the url is correct when reached
async function navigateToURL(page, locator, assertURL) {
  //click the card cart button on the products page
  await page.locator(locator).click();
  //assert successful addition to cart
  //client/#/dashboard/cart
  await expect(page).toHaveURL(assertURL);
}

//helper function to add an item to a cart
async function addItemToCart(page) {
  try {
    //wait for the first card to be visible
    await page.locator("h5 b").first().waitFor();

    //global variable to hold the product names for later assertion
    productText = await page.locator("h5 b").allTextContents();
    //console.log(productText);
    /*[
    'Automation 8',
    'Automation 8',
    'ADIDAS ORIGINAL',
    'ZARA COAT 3',
    'iphone 13 pro'
    ]*/

    //find all products and print out the text conent
    const productButtons = page
      .locator("button")
      .filter({ hasText: "Add To Cart" });
    //add .allTextContents(); to get all text contents as an array
    //console.log(productButtons);
    /*[
    ' Add To Cart',
    ' Add To Cart',
    ' Add To Cart',
    ' Add To Cart',
    ' Add To Cart'
    ]*/

    //dynamically find and click Add to Cart button for a specific product by selecting a random productName
    randomProduct = Math.floor(Math.random() * productText.length);
    //randomProduct = Math.floor(Math.random() * productText.length);
    console.log("Random Product Name: " + productText[randomProduct]);
    await productButtons.nth(randomProduct).click();
  } catch (error) {
    console.error("❌ Failed to add item to cart");
    throw error;
  }
}

/*
 Payment Method can be credit-card, paypal, waller OR note
*/
async function checkOutOrderDetails(
  page,
  paymentMethod,
  creditCard,
  month,
  year,
  cvv,
  nameOnCard,
  couponCode,
) {
  try {
    await page.getByText(paymentMethod, { exact: true }).click();

    // Enter credit card number
    const enterCC = page.locator(".field .text-validated");
    await enterCC.waitFor({ state: "visible" });
    await enterCC.fill(creditCard);

    // Select month & year
    const selectMonth = page.locator("(//select[@class='input ddl'])[1]");
    await selectMonth.selectOption(month);

    const selectYear = page.locator("(//select[@class='input ddl'])[2]");
    await selectYear.selectOption(year);

    const enterCVV = page.locator("(//input[@class='input txt'])[1]");
    await enterCVV.fill(cvv);

    const enterNameOnCard = page.locator("(//input[@class='input txt'])[2]");
    await enterNameOnCard.fill(nameOnCard);

    //coupon code is optional as not everyone may have one
    if (couponCode) {
      const coupon = page.locator("[name='coupon']");
      await coupon.fill(couponCode);

      const applyCoupon = page.locator("[type='submit']");
      await applyCoupon.click();

      //assert coupon applied
      await page.locator(".field.small .ng-star-inserted").first().waitFor();
      const couponApplied = page.locator(".field.small .ng-star-inserted");

      expect(await couponApplied.textContent()).toContain("Coupon Applied");
    }
  } catch (error) {
    console.error("❌ Checkout failed");
    console.error({
      paymentMethod,
      creditCardEnding: creditCard.slice(-4),
    });

    throw error;
  }
}

async function shippingInformation(page, email, countryToSelect) {
  try {
    const shipEmail = await page.locator(".user__name label").textContent();
    expect(shipEmail).toEqual(email);

    const country = page.locator("[placeholder='Select Country']");
    await country.pressSequentially(countryToSelect);  //delay the typing sequentially 150ms if you wanted to {delay : 150}

    await page.waitForSelector(".ta-results button");

    await page
      .getByRole("button", { name: ` ${countryToSelect}`, exact: true })
      .click();

     return {email, countryToSelect};
      
  } catch (error) {
    console.error("❌ Shipping information failed");
    console.error({ email, countryToSelect });
    throw error;
  }
}
