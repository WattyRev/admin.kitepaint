import React from 'react';
import { fireEvent } from '@testing-library/react';
import mockUsers from '../../../mock-api/data/users';
import { transformUser } from '../../models/User';
import api from '../../api/KitePaintApi';
import Users from '../Users';

jest.mock('../../api/KitePaintApi');

describe('Users', () => {
    beforeEach(() => {
        api.getUsers.mockResolvedValue({
            users: mockUsers.map(transformUser),
            total: mockUsers.length,
        });
        api.updateUser.mockResolvedValue();
        api.resetUserPassword.mockResolvedValue();
    });
    it('renders', () => {
        expect.assertions(1);
        const { getByText } = renderWithTheme(<Users />);
        const headingElement = getByText(/Users/);
        expect(headingElement).toBeInTheDocument();
    });
    it('displays each user', async () => {
        expect.assertions(1);
        const { findAllByTestId } = renderWithTheme(<Users />);
        expect(await findAllByTestId('user-row')).toHaveLength(mockUsers.length);
    });
    it('can search users', () => {
        expect.assertions(1);
        const { getByTestId, getByPlaceholderText } = renderWithTheme(<Users />);
        fireEvent.change(getByTestId('search-criteria'), {
            target: {
                value: 'username',
            },
        });
        fireEvent.change(getByPlaceholderText('Search'), {
            target: {
                value: 'test',
            },
        });
        fireEvent.blur(getByPlaceholderText('Search'), {
            target: {
                value: 'test',
            },
        });
        expect(api.getUsers).toHaveBeenCalledWith({
            searchCriteria: 'username',
            searchTerm: 'test',
            sortBy: 'last_login',
            sortDirection: 'DESC',
            page: 1,
            pageSize: 100,
        });
    });
    it('sorts by last login, newest first, by default', async () => {
        expect.assertions(3);
        const { findAllByTestId, getByTestId } = renderWithTheme(<Users />);
        await findAllByTestId('user-row');
        expect(api.getUsers).toHaveBeenCalledWith(
            expect.objectContaining({ sortBy: 'last_login', sortDirection: 'DESC' })
        );
        expect(getByTestId('sort-last_login').closest('th')).toHaveAttribute(
            'aria-sort',
            'descending'
        );
        expect(getByTestId('sort-username').closest('th')).toHaveAttribute('aria-sort', 'none');
    });
    it('sorts in both directions when a column header is clicked', async () => {
        expect.assertions(4);
        const { findAllByTestId, getByTestId } = renderWithTheme(<Users />);
        await findAllByTestId('user-row');
        fireEvent.click(getByTestId('sort-username'));
        expect(api.getUsers).toHaveBeenLastCalledWith(
            expect.objectContaining({ sortBy: 'username', sortDirection: 'ASC' })
        );
        await findAllByTestId('user-row');
        fireEvent.click(getByTestId('sort-username'));
        expect(api.getUsers).toHaveBeenLastCalledWith(
            expect.objectContaining({ sortBy: 'username', sortDirection: 'DESC' })
        );
        await findAllByTestId('user-row');
        fireEvent.click(getByTestId('sort-email'));
        expect(api.getUsers).toHaveBeenLastCalledWith(
            expect.objectContaining({ sortBy: 'email', sortDirection: 'ASC' })
        );
        await findAllByTestId('user-row');
        fireEvent.click(getByTestId('sort-created'));
        expect(api.getUsers).toHaveBeenLastCalledWith(
            expect.objectContaining({ sortBy: 'create_time', sortDirection: 'DESC' })
        );
    });
    it('does not render pagination when there is only one page', async () => {
        expect.assertions(1);
        const { findAllByTestId, queryByTestId } = renderWithTheme(<Users />);
        await findAllByTestId('user-row');
        expect(queryByTestId('pagination')).toBeNull();
    });
    it('changes the page when a pagination button is clicked', async () => {
        expect.assertions(1);
        api.getUsers.mockResolvedValue({
            users: mockUsers.map(transformUser),
            total: 250,
        });
        const { findByLabelText } = renderWithTheme(<Users />);
        fireEvent.click(await findByLabelText('Next page'));
        expect(api.getUsers).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2 }));
    });
    it('can edit a user', async () => {
        expect.assertions(3);
        const { findAllByText, findByTestId, getByLabelText, getByText } = renderWithTheme(
            <Users />
        );
        const [editButton] = await findAllByText('Edit');
        fireEvent.click(editButton);
        expect(await findByTestId('user-form')).toBeDefined();

        const newValues = {
            loginid: '0',
            username: 'Boogers',
            email: 'boogers@test.com',
            activated: false,
        };

        fireEvent.change(getByLabelText('Username'), {
            target: {
                value: newValues.username,
            },
        });
        fireEvent.change(getByLabelText('Email'), {
            target: {
                value: newValues.email,
            },
        });
        fireEvent.change(getByLabelText('Active'), {
            target: {
                value: newValues.activated.toString(),
            },
        });
        fireEvent.click(getByText('Save'));
        expect(api.updateUser).toHaveBeenCalled();
        const savedUser = api.updateUser.mock.calls[0][0];
        const submittedValues = savedUser.getProperties(...Object.keys(newValues));
        expect(submittedValues).toStrictEqual(newValues);
    });
    it('reset a users password', async () => {
        expect.assertions(3);
        const { findAllByText, findByText, getByText } = renderWithTheme(<Users />);
        const [resetButton] = await findAllByText('Reset Password');
        fireEvent.click(resetButton);
        expect(
            await findByText('Are you sure you want to reset the password for Watty?')
        ).toBeDefined();

        fireEvent.click(getByText('Confirm'));
        expect(api.resetUserPassword).toHaveBeenCalled();
        const savedUser = api.resetUserPassword.mock.calls[0][0];
        expect(savedUser.get('loginid')).toStrictEqual('0');
    });
});
