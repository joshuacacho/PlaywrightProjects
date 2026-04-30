# This is a Gherkin feature file for testing the greeting functionality of a greeter application. It defines a scenario where the greeter says hello, and the expected outcome is that 

Feature: eCommernce Login Fail BeforeStep/AfterStep Hooks

  @LoginFailBeforeAfterStep
  @webTestser
  Scenario: Successful login with valid credentials BeforeStep/AfterStep Hooks
    Given Before After Step Hooks - the user navigates to the login page within "https://rahulshettyacademy.com/client/#/auth/login"
    #purposely failing to take screenshot using 
    When Before After Step Hooks - the user enters valid username "testUser63@example.com" and the password "Test@1232"
    And Before After Step Hooks - attempts to click the login button
    Then Before After Step Hooks - the user should be logged in successfully with a URL containing "dashboard"


    