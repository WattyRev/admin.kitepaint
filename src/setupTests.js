/* eslint-disable zillow/import/no-extraneous-dependencies */
import { render } from '@testing-library/react';
import theme from 'react-watty-ui';
import { ThemeProvider } from 'styled-components';
import React from 'react';

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

global.renderWithTheme = content => render(<ThemeProvider theme={theme}>{content}</ThemeProvider>);

// Make prop-types fail tests
const originalConsoleError = console.error;
console.error = message => {
    if (/(Failed prop types)/.test(message)) {
        throw new Error(message);
    }
    originalConsoleError(message);
};
