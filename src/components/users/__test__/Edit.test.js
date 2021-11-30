import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import User from '../../../models/User';
import api from '../../../api/KitePaintApi';
import UsersEdit from '../Edit';

jest.mock('../../../api/KitePaintApi');

describe('UsersEdit', () => {
    let defaultProps;
    beforeEach(() => {
        defaultProps = {
            user: new User({
                loginid: '1',
            }),
            onClose: jest.fn(),
            onSubmit: jest.fn(),
        };
    });
    it('renders', () => {
        expect.assertions(1);
        const subject = renderWithTheme(<UsersEdit {...defaultProps} />);
        expect(subject).toBeDefined();
    });
    it('renders without a user', () => {
        expect.assertions(1);
        defaultProps.user = null;
        const subject = renderWithTheme(<UsersEdit {...defaultProps} />);
        expect(subject).toBeDefined();
    });
    it('opens the modal if a user is provided', () => {
        expect.assertions(1);
        const { getByTestId } = renderWithTheme(<UsersEdit {...defaultProps} />);
        expect(getByTestId('user-form')).toBeDefined();
    });
    it('does not open the modal if no user is provided', () => {
        expect.assertions(1);
        defaultProps.user = null;
        const { getByTestId } = renderWithTheme(<UsersEdit {...defaultProps} />);
        expect(() => getByTestId('user-form')).toThrow();
    });
    it('calls onClose when the form is successfully submitted', async () => {
        api.updateUser.mockResolvedValue();
        const { getByText } = renderWithTheme(<UsersEdit {...defaultProps} />);
        fireEvent.click(getByText('Save'));
        await waitFor(() => expect(defaultProps.onClose).toHaveBeenCalled());
    });
    it('calls onSubmit when the form is successfully submitted', async () => {
        api.updateUser.mockResolvedValue();
        const { getByText } = renderWithTheme(<UsersEdit {...defaultProps} />);
        fireEvent.click(getByText('Save'));
        await waitFor(() => expect(defaultProps.onSubmit).toHaveBeenCalled());
    });
    it('does not call onClose when form submission fails', async () => {
        expect.assertions(3);
        api.updateUser.mockRejectedValue();
        const { getByText } = renderWithTheme(<UsersEdit {...defaultProps} />);
        fireEvent.click(getByText('Save'));
        await waitFor(() => expect(getByText('Save')).toBeDisabled());
        await waitFor(() => expect(getByText('Save')).not.toBeDisabled());
        expect(defaultProps.onClose).not.toHaveBeenCalled();
    });
    it('does not call onSubmit when form submission fails', async () => {
        expect.assertions(3);
        api.updateUser.mockRejectedValue();
        const { getByText } = renderWithTheme(<UsersEdit {...defaultProps} />);
        fireEvent.click(getByText('Save'));
        await waitFor(() => expect(getByText('Save')).toBeDisabled());
        await waitFor(() => expect(getByText('Save')).not.toBeDisabled());
        expect(defaultProps.onSubmit).not.toHaveBeenCalled();
    });
    it('prevents multiple submissions', () => {
        expect.assertions(1);
        api.updateUser.mockResolvedValue();
        const { getByText } = renderWithTheme(<UsersEdit {...defaultProps} />);
        fireEvent.click(getByText('Save'));
        fireEvent.click(getByText('Save'));
        expect(api.updateUser).toHaveBeenCalledTimes(1);
    });
});
