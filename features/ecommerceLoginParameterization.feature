# This is a Gherkin feature file for testing the greeting functionality of a greeter application. It defines a scenario where the greeter says hello, and the expected outcome is that 

Feature: eCommernce Login Parameterized credentials

  @ParameterizedLogin
  #need to add to give life to Before Hook which initializes the browser, context and page objects.
    #could remove the tags but other tests are also using them so just easier to add
  @webTestser 
  Scenario Outline: Successful login with Parameterized credentials
    Given Parameterized the user navigates to the login page within "https://rahulshettyacademy.com/client/#/auth/login"
    #parameterized username and password that will be passed from the Examples table below, and we are purposely failing one of the logins to demonstrate the screenshot capture in the AfterStep hook.
    When Parameterized the user enters valid username "<username>" and the password "<password>"
    And Parameterized attempts to click the login button

    #valid login
    #nnn invalid login
    Examples:
      | username                   | password   |
      | testUser63@example.com     | Test@5678  |
      | testUser64@example.com     | Test@1234  |
      | testUser65@example.com     | Test@2584  | 