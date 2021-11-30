import React from 'react';
import { render } from '@testing-library/react';
import App from '../App';
import api from '../../api/KitePaintApi';

jest.mock('../../api/KitePaintApi');

jest.mock('../Router', () => ({
    __esModule: true,
    default: () => <div data-testid="router" />,
}));

describe('App', () => {
    beforeEach(() => {
        api.ping.mockResolvedValue();
    });
    it('renders the router', async () => {
        const { findByTestId } = render(<App />);
        const routerElement = await findByTestId('router');
        expect(routerElement).toBeInTheDocument();
    });
});
