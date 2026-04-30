# This is a Gherkin feature file for testing the greeting functionality of a greeter application. It defines a scenario where the greeter says hello, and the expected outcome is that the user should have heard "hello".
Feature: Greeting

  Scenario: Say hello
    When the greeter says hello
    # This is a string and must be capture as so in the assert
        # if you put "hello" with a . after it this will brea it
    Then I should have heard "hello" 