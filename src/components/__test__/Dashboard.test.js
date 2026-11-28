import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render } from '@testing-library/react';
import theme from 'react-watty-ui';
import { ThemeProvider } from 'styled-components';
import mockUsers from '../../../mock-api/data/users';
import { transformUser } from '../../models/User';
import { transformDesign } from '../../models/Design';
import api from '../../api/KitePaintApi';
import Dashboard from '../Dashboard';

jest.mock('../../api/KitePaintApi');

const renderDashboard = () =>
    render(
        <ThemeProvider theme={theme}>
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        </ThemeProvider>
    );

const buildDesign = (id, status) =>
    transformDesign({
        id: String(id),
        active: '1',
        created: '01/01/2021',
        user: '0',
        username: 'Watty',
        status,
        name: `Design ${id}`,
        product: '3',
        product_name: 'Void',
        updated: '01/02/2021',
    });

describe('Dashboard', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        api.getDashboardStats.mockResolvedValue({
            users: { total: 1200, active30: 34, active365: 560 },
            designs: { total: 4321, created30: 12, created60: 25 },
        });
        api.getUsers.mockResolvedValue({
            users: mockUsers.slice(0, 2).map(transformUser),
            total: mockUsers.length,
        });
        api.getDesigns.mockResolvedValue({
            designs: [buildDesign(1, '0'), buildDesign(2, '1'), buildDesign(3, '2')],
            total: 3,
        });
        api.updateUser.mockResolvedValue();
        api.updateDesign.mockResolvedValue();
        api.resetUserPassword.mockResolvedValue();
    });

    it('renders the heading and both sections', async () => {
        expect.assertions(3);
        const { getByText, findByTestId } = renderDashboard();
        expect(getByText('Dashboard')).toBeInTheDocument();
        expect(await findByTestId('users-section')).toBeInTheDocument();
        expect(await findByTestId('designs-section')).toBeInTheDocument();
    });

    it('displays the user and design stats', async () => {
        expect.assertions(6);
        const { findByTestId } = renderDashboard();
        expect(await findByTestId('recent-users-table')).toBeInTheDocument();
        expect((await findByTestId('stat-users-total-value')).textContent).toBe('1,200');
        expect((await findByTestId('stat-users-active30-value')).textContent).toBe('34');
        expect((await findByTestId('stat-users-active365-value')).textContent).toBe('560');
        expect((await findByTestId('stat-designs-total-value')).textContent).toBe('4,321');
        expect((await findByTestId('stat-designs-created60-value')).textContent).toBe('25');
    });

    it('requests the five most recent users and designs', async () => {
        expect.assertions(2);
        const { findByTestId } = renderDashboard();
        await findByTestId('recent-users-table');
        expect(api.getUsers).toHaveBeenCalledWith({
            page: 1,
            pageSize: 5,
            sortBy: 'create_time',
            sortDirection: 'DESC',
        });
        expect(api.getDesigns).toHaveBeenCalledWith({
            page: 1,
            pageSize: 5,
            sortBy: 'created',
            sortDirection: 'DESC',
        });
    });

    it('lists the recent users with edit and reset password actions', async () => {
        expect.assertions(3);
        const { findAllByTestId, getAllByText } = renderDashboard();
        expect(await findAllByTestId('user-row')).toHaveLength(2);
        expect(getAllByText('Edit').length).toBeGreaterThanOrEqual(2);
        expect(getAllByText('Reset Password')).toHaveLength(2);
    });

    it('lists the recent designs and only links to viewable ones', async () => {
        expect.assertions(2);
        const { findAllByTestId } = renderDashboard();
        expect(await findAllByTestId('design-row')).toHaveLength(3);
        // Private designs have no view link, Unlisted and Public do.
        expect(await findAllByTestId('view-link')).toHaveLength(2);
    });

    it('shows the user and product with their ids', async () => {
        expect.assertions(2);
        const { findAllByText } = renderDashboard();
        expect(await findAllByText('Watty (0)')).toHaveLength(3);
        expect(await findAllByText('Void (3)')).toHaveLength(3);
    });

    it('opens the user editor', async () => {
        expect.assertions(1);
        const { findAllByText, findByTestId } = renderDashboard();
        const editButtons = await findAllByText('Edit');
        fireEvent.click(editButtons[0]);
        expect(await findByTestId('user-form')).toBeInTheDocument();
    });

    it('still renders when the stats fail to load', async () => {
        expect.assertions(2);
        api.getDashboardStats.mockRejectedValue();
        const { findAllByTestId, findByTestId } = renderDashboard();
        expect(await findAllByTestId('user-row')).toHaveLength(2);
        expect((await findByTestId('stat-users-total-value')).textContent).toBe('-');
    });
});
