import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

jest.mock('../Router', () => ({
    __esModule: true,
    default: () => <div data-testid="router" />,
}));

describe('App', () => {
    it('renders the router', () => {
        render(<App />);
        const routerElement = screen.getByTestId(/router/);
        expect(routerElement).toBeInTheDocument();
    });
});
