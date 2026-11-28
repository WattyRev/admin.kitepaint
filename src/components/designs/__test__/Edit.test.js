import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import Design from '../../../models/Design';
import User from '../../../models/User';
import api from '../../../api/KitePaintApi';
import DesignsEdit from '../Edit';

jest.mock('../../../api/KitePaintApi');

describe('DesignsEdit', () => {
    let defaultProps;
    beforeEach(() => {
        defaultProps = {
            design: new Design({
                id: '1',
            }),
            onClose: jest.fn(),
            onSubmit: jest.fn(),
        };
    });
    it('renders', () => {
        expect.assertions(1);
        const subject = renderWithTheme(<DesignsEdit {...defaultProps} />);
        expect(subject).toBeDefined();
    });
    it('renders without a design', () => {
        expect.assertions(1);
        defaultProps.design = null;
        const subject = renderWithTheme(<DesignsEdit {...defaultProps} />);
        expect(subject).toBeDefined();
    });
    it('opens the modal if a design is provided', () => {
        expect.assertions(1);
        const { getByTestId } = renderWithTheme(<DesignsEdit {...defaultProps} />);
        expect(getByTestId('design-form')).toBeDefined();
    });
    it('does not open the modal if no design is provided', () => {
        expect.assertions(1);
        defaultProps.design = null;
        const { getByTestId } = renderWithTheme(<DesignsEdit {...defaultProps} />);
        expect(() => getByTestId('design-form')).toThrow();
    });
    it('calls onClose when the form is successfully submitted', async () => {
        api.updateDesign.mockResolvedValue();
        const { getByText } = renderWithTheme(<DesignsEdit {...defaultProps} />);
        fireEvent.click(getByText('Save'));
        await waitFor(() => expect(defaultProps.onClose).toHaveBeenCalled());
    });
    it('calls onSubmit when the form is successfully submitted', async () => {
        api.updateDesign.mockResolvedValue();
        const { getByText } = renderWithTheme(<DesignsEdit {...defaultProps} />);
        fireEvent.click(getByText('Save'));
        await waitFor(() => expect(defaultProps.onSubmit).toHaveBeenCalled());
    });
    it('does not call onClose when form submission fails', async () => {
        expect.assertions(3);
        api.updateDesign.mockRejectedValue();
        const { getByText } = renderWithTheme(<DesignsEdit {...defaultProps} />);
        fireEvent.click(getByText('Save'));
        await waitFor(() => expect(getByText('Save')).toBeDisabled());
        await waitFor(() => expect(getByText('Save')).not.toBeDisabled());
        expect(defaultProps.onClose).not.toHaveBeenCalled();
    });
    it('does not call onSubmit when form submission fails', async () => {
        expect.assertions(3);
        api.updateDesign.mockRejectedValue();
        const { getByText } = renderWithTheme(<DesignsEdit {...defaultProps} />);
        fireEvent.click(getByText('Save'));
        await waitFor(() => expect(getByText('Save')).toBeDisabled());
        await waitFor(() => expect(getByText('Save')).not.toBeDisabled());
        expect(defaultProps.onSubmit).not.toHaveBeenCalled();
    });
    it('shows the user and product as name (id)', () => {
        expect.assertions(2);
        defaultProps.design = new Design({
            id: '1',
            user: '12',
            username: 'Void',
            product: '3',
            productName: 'B-Series PRO',
        });
        const { getByDisplayValue } = renderWithTheme(<DesignsEdit {...defaultProps} />);
        expect(getByDisplayValue('Void (12)')).toBeInTheDocument();
        expect(getByDisplayValue('B-Series PRO (3)')).toBeInTheDocument();
    });
    it('shows only the ids when there are no names', () => {
        expect.assertions(2);
        defaultProps.design = new Design({ id: '1', user: '12', product: '3' });
        const { getByDisplayValue } = renderWithTheme(<DesignsEdit {...defaultProps} />);
        expect(getByDisplayValue('12')).toBeInTheDocument();
        expect(getByDisplayValue('3')).toBeInTheDocument();
    });
    it('searches users by what is typed', async () => {
        expect.hasAssertions();
        api.searchUsers.mockResolvedValue([]);
        const { getByLabelText } = renderWithTheme(<DesignsEdit {...defaultProps} />);
        fireEvent.change(getByLabelText('User'), { target: { value: 'vo' } });
        await waitFor(() => expect(api.searchUsers).toHaveBeenCalledWith('vo'));
    });
    it('saves the id of the picked user', async () => {
        expect.assertions(3);
        defaultProps.design = new Design({
            id: '1',
            user: '12',
            username: 'Void',
            name: 'boogers',
        });
        api.searchUsers.mockResolvedValue([new User({ loginid: '13', username: 'Voidling' })]);
        api.updateDesign.mockResolvedValue();
        const { getByLabelText, getByText, findByTestId } = renderWithTheme(
            <DesignsEdit {...defaultProps} />
        );
        fireEvent.change(getByLabelText('User'), {
            target: { value: 'voidl' },
        });
        fireEvent.mouseDown(await findByTestId('lookup-result'));
        expect(getByLabelText('User')).toHaveValue('Voidling (13)');
        fireEvent.click(getByText('Save'));
        await waitFor(() => expect(api.updateDesign).toHaveBeenCalledTimes(1));
        const savedDesign = api.updateDesign.mock.calls[0][0];
        expect(savedDesign.get('user')).toBe('13');
    });
    it('prevents multiple submissions', () => {
        expect.assertions(1);
        api.updateDesign.mockResolvedValue();
        const { getByText } = renderWithTheme(<DesignsEdit {...defaultProps} />);
        fireEvent.click(getByText('Save'));
        fireEvent.click(getByText('Save'));
        expect(api.updateDesign).toHaveBeenCalledTimes(1);
    });
    it('closes immediately on Escape when nothing has changed', () => {
        expect.assertions(2);
        jest.spyOn(window, 'confirm').mockReturnValue(true);
        renderWithTheme(<DesignsEdit {...defaultProps} />);
        fireEvent.keyDown(document, { key: 'Escape' });
        expect(window.confirm).not.toHaveBeenCalled();
        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
        window.confirm.mockRestore();
    });
    it('confirms before closing on Escape when there are changes', () => {
        expect.assertions(3);
        jest.spyOn(window, 'confirm').mockReturnValue(false);
        const { getByLabelText } = renderWithTheme(<DesignsEdit {...defaultProps} />);
        fireEvent.change(getByLabelText('Name'), {
            target: { value: 'changed' },
        });
        fireEvent.keyDown(document, { key: 'Escape' });
        expect(window.confirm).toHaveBeenCalledTimes(1);
        expect(defaultProps.onClose).not.toHaveBeenCalled();
        window.confirm.mockReturnValue(true);
        fireEvent.keyDown(document, { key: 'Escape' });
        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
        window.confirm.mockRestore();
    });
});
