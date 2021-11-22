/* eslint-disable zillow/import/no-extraneous-dependencies */
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Make prop-types fail tests
const originalConsoleError = console.error;
console.error = message => {
    if (/(Failed prop types)/.test(message)) {
        throw new Error(message);
    }
    originalConsoleError(message);
};
