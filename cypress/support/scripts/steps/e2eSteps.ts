import e2ePage from '../pages/e2ePage';
import {Given, When, Then} from '@badeball/cypress-cucumber-preprocessor';

Given('I am on the site window', () => {
    e2ePage.navigateToSite();
});

When('I click on a link', () => {
    e2ePage.clickOnALink();
});

Then('I text should be fond on the page', () => {
    e2ePage.assertAText();
});
