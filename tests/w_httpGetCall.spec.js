//Author: Josh
const { test, expect } = require("@playwright/test");

const httpDataSets = JSON.parse(
  JSON.stringify(require("../utils/placeOrderUNPW.json")),
);

test("Make HTTP GET Request using Playwright Request API", async ({
  request,
}) => {
  // Simple GET request
  const response = await request.get(
    "https://jsonplaceholder.typicode.com/posts/1",
  );

  // Verify status code
  expect(response.status()).toBe(200);

  // Get response body as JSON
  const responseBody = await response.json();
  console.log("Response Body:", responseBody);

  // Assertions on response body
  expect(responseBody.id).toBe(1);
  expect(responseBody.userId).toBe(1);
  expect(responseBody.title).toBeTruthy();
});

test("Make HTTP GET Request with Query Parameters", async ({ request }) => {
  // GET request with query parameters
  const response = await request.get(
    "https://jsonplaceholder.typicode.com/posts",
    {
      params: {
        userId: 1,
        _limit: 5,
      },
    },
  );

  expect(response.status()).toBe(200);

  const responseBody = await response.json();
  console.log("Posts Count:", responseBody.length);

  // Verify all posts belong to userId 1
  responseBody.forEach((post) => {
    expect(post.userId).toBe(1);
  });
});

test("Make HTTP GET Request with Headers", async ({ request }) => {
  // GET request with custom headers
  const response = await request.get(
    "https://jsonplaceholder.typicode.com/users/1",
    {
      headers: {
        Accept: "application/json",
        "Custom-Header": "custom-value",
      },
    },
  );

  expect(response.status()).toBe(200);

  const responseBody = await response.json();
  console.log("User Name:", responseBody.name);
  expect(responseBody.username).toBeTruthy();
});

test("Intercept GET Request in Browser Context", async ({ page }) => {
  // Listen for all API responses
  const responses = [];
  page.on("response", (response) => {
    if (response.request().method() === "GET") {
      responses.push({
        url: response.url(),
        status: response.status(),
      });
    }
  });

  // Navigate to a page that makes GET requests
  await page.goto("https://jsonplaceholder.typicode.com/posts/1");

  // Give it a moment to capture responses
  await page.waitForTimeout(1000);

  console.log("Intercepted Responses:", responses);
  expect(responses.length).toBeGreaterThan(0);
});

test("Make GET Request and Validate Response Time", async ({ request }) => {
  const startTime = Date.now();

  const response = await request.get(
    "https://jsonplaceholder.typicode.com/posts/1",
  );

  const endTime = Date.now();
  const responseTime = endTime - startTime;

  expect(response.status()).toBe(200);
  expect(responseTime).toBeLessThan(5000); // Response should come within 5 seconds

  console.log(`Response Time: ${responseTime}ms`);
});

for (const data of httpDataSets) {
  test(`Make HTTP GET Request using dataset user [${data.username}]`, async ({
    request,
  }) => {
    const response = await request.get(
      "https://jsonplaceholder.typicode.com/posts",
      {
        params: {
          userId: 1,
          _limit: 1,
        },
        headers: {
          Accept: "application/json",
          "X-Test-User": data.username,
        },
      },
    );

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    console.log(
      `Dataset [${data.username}] returned posts:`,
      responseBody.length,
    );
    expect(responseBody.length).toBeGreaterThan(0);
  });
}

test("Make GET Request with Error Handling", async ({ request }) => {
  try {
    // GET request to non-existent endpoint
    const response = await request.get(
      "https://jsonplaceholder.typicode.com/posts/99999",
    );

    // JSONPlaceholder will return 200 but with empty data for non-existent IDs
    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    console.log("Response for non-existent post:", responseBody);
  } catch (error) {
    console.error("Error during GET request:", error.message);
  }
});
