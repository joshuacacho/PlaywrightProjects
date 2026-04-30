//CONVERTING THE BELOW TO TS
    // const { test: base } = require("@playwright/test");

    // //So the premise is you can extend custom fixtures from a test by extending its base properties.
    // //you must exports.<variableName> so it can exported and be used in any other test

    // exports.customTests = base.extend({
    //     testDataForOrder: {
    //         username: "testUser63@example.com",
    //         password: "Test@1234",
    //         cartCountURL: "https://rahulshettyacademy.com/api/ecom/user/get-cart-count/**"
    //     },
    // });


//UPDATE FOR TypeScript

//So the premise is you can extend custom fixtures from a test by extending its base properties.
// //you must exports.<variableName> so it can exported and be used in any other test

import {test as baseTest} from '@playwright/test';


//for testDataForOrder error we will define an interface for the username, passwod and cartCountURL properties and then use that interface to type the testDataForOrder object below
    //when you hover over the testDataForOrder you get the below HINT
    // (property) testDataForOrder: {
    //     username: string;
    //     password: string;
    //     cartCountURL: string;
    // }   

//interface for the testDataForOrder properties - CONTRACT for the properties that must be included in the testDataForOrder object
interface TestDataForOrder {
    username: string;
    password: string;
    cartCountURL: string;
}

//The testDataForOrder is returning an error when using TS indicating the below
    //
export const customTests = baseTest.extend<{testDataForOrder: TestDataForOrder}>({
        testDataForOrder: {
            username: "testUser63@example.com",
            password: "Test@1234",
            cartCountURL: "https://rahulshettyacademy.com/api/ecom/user/get-cart-count/**"
        },
    });