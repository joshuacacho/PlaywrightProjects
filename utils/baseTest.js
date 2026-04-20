const { test: base } = require("@playwright/test");

//So the premise is you can extend custom fixtures from a test by extending its base properties.
//you must exports.<variableName> so it can exported and be used in any other test

exports.customTests = base.extend({
    testDataForOrder: {
        username: "testUser63@example.com",
        password: "Test@1234",
        cartCountURL: "https://rahulshettyacademy.com/api/ecom/user/get-cart-count/**"
    },
});