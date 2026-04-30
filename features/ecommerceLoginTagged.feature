# This is a Gherkin feature file for testing the greeting functionality of a greeter application. It defines a scenario where the greeter says hello, and the expected outcome is that 

Feature: eCommernce Login Fail Tagged Hooks

  #could tag any hook with @Tagged and it will execute for the scenario tagged with @TaggedHook, in this case we are tagging the BeforeStep and AfterStep hooks to execute for this scenario, and we are purposely failing the login to demonstrate the screenshot capture in the AfterStep hook.
  @Login
  @webTestser
  Scenario: Successful login with valid credentials Tagged Hooks
    Given Tagged the user navigates to the login page within "https://rahulshettyacademy.com/client/#/auth/login"
    #purposely failing to take screenshot using 
    When Tagged the user enters valid username "testUser63@example.com" and the password "Test@1234"


    