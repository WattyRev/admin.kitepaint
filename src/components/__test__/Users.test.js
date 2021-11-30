import React from 'react';
import { fireEvent } from '@testing-library/react';
import mockUsers from '../../../mock-api/data/users';
import { transformUser } from '../../models/User';
import api from '../../api/KitePaintApi';
import Users from '../Users';

jest.mock('../../api/KitePaintApi');

describe('Users', () => {
    beforeEach(() => {
        api.getUsers.mockResolvedValue(mockUsers.map(transformUser));
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
        });
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
