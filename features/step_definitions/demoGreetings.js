const assert = require('assert')
const { When, Then } = require('@cucumber/cucumber')

//Methods where the steps definition file is located. The step definition file is where you write the code that will be executed when Cucumber runs your tests. In this case, we are using the When and Then methods from the @cucumber/cucumber library to define our step definitions.

When('the greeter says hello', function () {
    this.grtrGreeting = "hello";
    console.log("Greeter says: " + this.grtrGreeting);
});

//Cucumber tries to match the entire line (minus the keyword) against your step definition pattern I should have heard {string}. The trailing . means the line becomes:
//I should have heard "hello".
Then('I should have heard {string}', function (expectedResponse) {
    console.log("Expected response: " + expectedResponse);
    assert.equal(this.grtrGreeting, expectedResponse)
});
