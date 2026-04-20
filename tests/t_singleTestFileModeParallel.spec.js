const { test, expect } = require("@playwright/test");


//this will run all tests in this file in parallel with each other, which can significantly reduce the overall test execution time, especially when you have a large number of tests. However, it's important to ensure that your tests are designed to run in parallel and do not have dependencies on each other, as this can lead to flaky tests and unpredictable results. Additionally, you may want to consider using test.only for specific tests during development to focus on them without running the entire suite in parallel.
test.describe.configure({mode: 'parallel'});


const homePageURL = "https://rahulshettyacademy.com/angularpractice";
const shopPageURL = "https://rahulshettyacademy.com/angularpractice/shop";
const selenPracticeURL =
  "https://rahulshettyacademy.com/seleniumPractise/#/offers";

test("GetByLabel & Playwright UI Runner", async ({ page }) => {
  await goToURL(page, homePageURL);

  //playwright GetByLabel checkbox
  const getByLabelCheckCox = page.getByLabel(
    "Check me out if you Love IceCreams!",
  );
  await getByLabelCheckCox.click();
  expect(getByLabelCheckCox).toBeChecked();

  //playwright GetByLabel dropdown
  const getByLabelDropDown = page.getByLabel("Gender");
  await getByLabelDropDown.selectOption("Female");
  expect(getByLabelDropDown).toHaveValue("Female");

  //playwright GetByLabel radio button
  const getByLabelRadioButton = page.getByLabel("Employed");
  await getByLabelRadioButton.click();
  expect(getByLabelRadioButton).toBeChecked();

  const getByLabelRadioButton2 = page.getByLabel("Student");
  await getByLabelRadioButton2.check();
  expect(getByLabelRadioButton2).toBeChecked();

  //await page.pause();
});

test("getByPlaceHolder", async ({ page }) => {
  await goToURL(page, homePageURL);

  //can access by label also if you wanted to
  const getByLabelPW = page.getByLabel("Password");
  await getByLabelPW.fill("one more time");
  //await page.pause();

  const getByPlaceHolder = page.getByPlaceholder("Password");
  await getByPlaceHolder.fill("getByPlaceHolder Locator");
  //   this will fail since this is a password text field where the text will be *******
  //   expect(getByPlaceHolder).toHaveText("getByPlaceHolder Locator");
});

test("getByRole - Button", async ({ page }) => {
  await goToURL(page, homePageURL);

  const getByRoleButton = page.getByRole("button", { value: "Submit" });
  await getByRoleButton.click();
});

test("getByText", async ({ page }) => {
  await goToURL(page, homePageURL);

  const getByRole = page.getByRole("button", { value: "Submit" });
  await getByRole.click();

  //go to the object by using getByText
  const getByText = page.getByText(
    "Success! The Form has been submitted successfully!.",
  );
  await expect(getByText).toBeVisible();
});

test("getByRole - Link", async ({ page }) => {
  await goToURL(page, homePageURL);

  const getByRoleLink = page.getByRole("link", { name: "Shop" });
  await getByRoleLink.click();
});

test("getByRole - paige locator with filter", async ({ page }) => {
  await goToURL(page, shopPageURL);

  await productTextButtonToClick(page, "Blackberry");
});

test("Handling Calendars", async ({ page }) => {
  //challenge is to
  //1.navigate to page
  //2.write an async function that clicks any year, date and month
  //2027-06-15 we will try
  //3.assert that date is correct

  await page.goto(selenPracticeURL);

  await pickDate(page, 2028, "February", "23");
});

async function goToURL(page, url) {
  try {
    await page.goto(url);
  } catch (error) {
    console.error(`❌ Failed to navigate to URL: ${url}`);
    throw error;
  }
}

async function productTextButtonToClick(page, itemText) {
  try {
    //click any
    const getByRoleLinkPageLocatorFilter = page
      .locator("app-card")
      .filter({ hasText: itemText })
      .getByRole("button", { name: "Add " });
    await getByRoleLinkPageLocatorFilter.click();
  } catch (error) {
    console.error(`❌ Failed to click on item: ${itemText}`);
    throw error;
  }
}

async function pickDate(page, yearToGoTo, monthToGoTo, dayToGoTo) {
  try {
    //select Year to start process
    const year = page.locator("[name='year']");
    await year.click();

    //wait for calendar to be visible POST selection above
    await page.locator(".react-calendar");

    //click on MM/YEAR selection to select year
    const yearSelection = page.locator(".react-calendar__navigation__label");
    await yearSelection.click();

    //click the right small > until the year is reached and then check that its the correct year and stop
    //grab current year
    const currentYear = await page
      .locator(".react-calendar__navigation__label span")
      .textContent();

    //select the small forward year icon until we get to the yearToGoTo value
    const smallArrowForward = page.locator(
      ".react-calendar__navigation__next-button",
    );

    for (let i = currentYear; i < yearToGoTo; i++) {
      await smallArrowForward.click();
    }

    //find the month and click it
    //no need to add button text since all buttons are distinct
    const monthToClick = page.getByText(monthToGoTo);
    await monthToClick.click();

    //grab the day to select and click it
    const dayToClick = page.getByRole("button", { name: dayToGoTo }).first(); //need to use string literals here to click
    console.log(dayToClick);
    await dayToClick.click();

    //verify the date is correct that was selected
    const date = page.locator("[name='date']");
    let finalDate = await date.getAttribute("value");
    //finalDate = await date.getAttribute("value");
    //finalDate = await date.getAttribute("value");

    //for each month need to find index
    //need to put await for value to be returned
    let indexedMonthToGoTo = await findMonthIndex(monthToGoTo);

    //for each day need to find whether or not to add 0 in front or not based on how value is returned
    let dayToGoWith0orNot = await dayToGoUpdate(dayToGoTo);

    console.log(
      finalDate,
      `${yearToGoTo}-${indexedMonthToGoTo}-${dayToGoWith0orNot}`,
    );

    //await page.pause();

    //asserting final
    expect(finalDate).toEqual(
      `${yearToGoTo}-${indexedMonthToGoTo}-${dayToGoWith0orNot}`,
    );

    //await page.pause();
  } catch (error) {
    console.error(`❌ Failed to set date ${error.stack}`);
    throw error;
  }
}

async function dayToGoUpdate(dayToGoTo) {
  if (dayToGoTo < 9) {
    dayToGoTo = "0" + dayToGoTo;
  }

  return dayToGoTo;
}

async function findMonthIndex(monthToGoTo) {
  //for each month need to find index
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthIndex = monthToGoTo;
  let indexedMonth = months.indexOf(monthIndex) + 1; //to offset index value

  //if < 10. 0-9 then need to add 0 in front it
  if (indexedMonth < 10) {
    indexedMonth = "0" + indexedMonth;
  }

  return indexedMonth;
}
