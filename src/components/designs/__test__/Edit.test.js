import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import Design from '../../../models/Design';
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
        api.submitDesign.mockResolvedValue();
        const { getByText } = renderWithTheme(<DesignsEdit {...defaultProps} />);
        fireEvent.click(getByText('Save'));
        await waitFor(() => expect(defaultProps.onClose).toHaveBeenCalled());
    });
    it('calls onSubmit when the form is successfully submitted', async () => {
        api.submitDesign.mockResolvedValue();
        const { getByText } = renderWithTheme(<DesignsEdit {...defaultProps} />);
        fireEvent.click(getByText('Save'));
        await waitFor(() => expect(defaultProps.onSubmit).toHaveBeenCalled());
    });
    it('does not call onClose when form submission fails', async () => {
        expect.assertions(3);
        api.submitDesign.mockRejectedValue();
        const { getByText } = renderWithTheme(<DesignsEdit {...defaultProps} />);
        fireEvent.click(getByText('Save'));
        await waitFor(() => expect(getByText('Save')).toBeDisabled());
        await waitFor(() => expect(getByText('Save')).not.toBeDisabled());
        expect(defaultProps.onClose).not.toHaveBeenCalled();
    });
    it('does not call onSubmit when form submission fails', async () => {
        expect.assertions(3);
        api.submitDesign.mockRejectedValue();
        const { getByText } = renderWithTheme(<DesignsEdit {...defaultProps} />);
        fireEvent.click(getByText('Save'));
        await waitFor(() => expect(getByText('Save')).toBeDisabled());
        await waitFor(() => expect(getByText('Save')).not.toBeDisabled());
        expect(defaultProps.onSubmit).not.toHaveBeenCalled();
    });
    it('prevents multiple submissions', () => {
        expect.assertions(1);
        api.submitDesign.mockResolvedValue();
        const { getByText } = renderWithTheme(<DesignsEdit {...defaultProps} />);
        fireEvent.click(getByText('Save'));
        fireEvent.click(getByText('Save'));
        expect(api.submitDesign).toHaveBeenCalledTimes(1);
    });
});
