# This is a Gherkin feature file for testing the greeting functionality of a greeter application. It defines a scenario where the greeter says hello, and the expected outcome is that 

Feature: eCommernce Login Before/All Hooks

  @webTests
  Scenario: Successful login with valid credentials Before/All Hooks
    Given Before All Hooks - the user navigates to the login page at "https://rahulshettyacademy.com/client/#/auth/login"
    When Before All Hooks - the user enters valid username "testUser63@example.com" and password "Test@1234"
    And Before All Hooks - clicks the login button
    Then Before All Hooks - the user should be logged in successfully with the URL containing "dashboard"


    