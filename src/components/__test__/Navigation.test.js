import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from 'react-watty-ui';
import Navigation from '../Navigation';

const renderNav = () =>
    render(
        <ThemeProvider theme={theme}>
            <MemoryRouter>
                <Navigation />
            </MemoryRouter>
        </ThemeProvider>
    );

describe('Navigation', () => {
    it('toggles the drawer with the menu button', () => {
        const { getByLabelText } = renderNav();
        const button = getByLabelText('Toggle navigation');
        expect(button).toHaveAttribute('aria-expanded', 'false');
        fireEvent.click(button);
        expect(button).toHaveAttribute('aria-expanded', 'true');
        fireEvent.click(button);
        expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('closes the drawer when a link is clicked', () => {
        const { getByLabelText, getByText } = renderNav();
        const button = getByLabelText('Toggle navigation');
        fireEvent.click(button);
        expect(button).toHaveAttribute('aria-expanded', 'true');
        fireEvent.click(getByText('Users'));
        expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('closes the drawer when the backdrop is clicked', () => {
        const { getByLabelText, getByTestId } = renderNav();
        const button = getByLabelText('Toggle navigation');
        fireEvent.click(button);
        fireEvent.click(getByTestId('nav-backdrop'));
        expect(button).toHaveAttribute('aria-expanded', 'false');
    });
});
