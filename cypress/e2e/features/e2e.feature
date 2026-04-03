#language:en

@roadmap

Feature: E2E

  Scenario: Search for a specific text on a site
    Given I am on the site window
    When I click on a link
    Then a text should be found on the page
