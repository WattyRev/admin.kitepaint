import React from 'react';
import { fireEvent } from '@testing-library/react';
import mockManufacturers from '../../../mock-api/data/manufacturers';
import { transformManufacturer } from '../../models/Manufacturer';
import api from '../../api/KitePaintApi';
import Manufacturers from '../Manufacturers';

jest.mock('../../api/KitePaintApi');

describe('Manufacturers', () => {
    beforeEach(() => {
        api.getManufacturers.mockResolvedValue(mockManufacturers.map(transformManufacturer));
        api.updateManufacturer.mockResolvedValue();
        api.createManufacturer.mockResolvedValue();
        api.payManufacturerInvoice.mockResolvedValue();
    });
    it('renders', () => {
        expect.assertions(1);
        const { getByText } = renderWithTheme(<Manufacturers />);
        const headingElement = getByText(/Manufacturers/);
        expect(headingElement).toBeInTheDocument();
    });
    it('displays each manufacturer', async () => {
        expect.assertions(1);
        const { findAllByTestId } = renderWithTheme(<Manufacturers />);
        expect(await findAllByTestId('manufacturer-row')).toHaveLength(mockManufacturers.length);
    });
    it('can edit a manufacturer', async () => {
        expect.assertions(3);
        const { findAllByText, findByTestId, getByLabelText, getByText } = renderWithTheme(
            <Manufacturers />
        );
        const [editButton] = await findAllByText('Edit');
        fireEvent.click(editButton);
        expect(await findByTestId('manufacturer-form')).toBeDefined();

        const newValues = {
            id: '0',
            activated: false,
            name: 'Boogers',
            contact_name: 'Boogers McGee',
            contact_phone: '1-800-boogers',
            contact_email: 'boogers@test.com',
            billing_email: 'boogers-business@test.com',
            invoice_amount: 200,
            logo: 'Boogers.jpg',
            website: 'http://boogers.com',
        };

        fireEvent.change(getByLabelText('Activated'), {
            target: {
                value: newValues.activated.toString(),
            },
        });
        fireEvent.change(getByLabelText('Name'), {
            target: {
                value: newValues.name,
            },
        });
        fireEvent.change(getByLabelText('Contact Name'), {
            target: {
                value: newValues.contact_name,
            },
        });
        fireEvent.change(getByLabelText('Contact Phone'), {
            target: {
                value: newValues.contact_phone,
            },
        });
        fireEvent.change(getByLabelText('Contact Email'), {
            target: {
                value: newValues.contact_email,
            },
        });
        fireEvent.change(getByLabelText('Billing Email'), {
            target: {
                value: newValues.billing_email,
            },
        });
        fireEvent.change(getByLabelText('Invoice Amount'), {
            target: {
                value: newValues.invoice_amount.toString(),
            },
        });
        fireEvent.change(getByLabelText('Logo'), {
            target: {
                value: newValues.logo,
            },
        });
        fireEvent.change(getByLabelText('Website'), {
            target: {
                value: newValues.website,
            },
        });
        fireEvent.click(getByText('Save'));
        expect(api.updateManufacturer).toHaveBeenCalled();
        const savedManufacturer = api.updateManufacturer.mock.calls[0][0];
        const submittedValues = savedManufacturer.getProperties(...Object.keys(newValues));
        expect(submittedValues).toStrictEqual(newValues);
    });
    it('can create a new manufacturer', async () => {
        expect.assertions(3);
        const { findAllByText, findByTestId, getByLabelText, getByText } = renderWithTheme(
            <Manufacturers />
        );
        const [createButton] = await findAllByText('Add New Manufacturer');
        fireEvent.click(createButton);
        expect(await findByTestId('manufacturer-form')).toBeDefined();

        const newValues = {
            id: null,
            name: 'Boogers',
            contact_name: 'Boogers McGee',
            contact_phone: '1-800-boogers',
            contact_email: 'boogers@test.com',
            billing_email: 'boogers-business@test.com',
            invoice_amount: 200,
            logo: 'Boogers.jpg',
            website: 'http://boogers.com',
        };

        fireEvent.change(getByLabelText('Name'), {
            target: {
                value: newValues.name,
            },
        });
        fireEvent.change(getByLabelText('Contact Name'), {
            target: {
                value: newValues.contact_name,
            },
        });
        fireEvent.change(getByLabelText('Contact Phone'), {
            target: {
                value: newValues.contact_phone,
            },
        });
        fireEvent.change(getByLabelText('Contact Email'), {
            target: {
                value: newValues.contact_email,
            },
        });
        fireEvent.change(getByLabelText('Billing Email'), {
            target: {
                value: newValues.billing_email,
            },
        });
        fireEvent.change(getByLabelText('Invoice Amount'), {
            target: {
                value: newValues.invoice_amount.toString(),
            },
        });
        fireEvent.change(getByLabelText('Logo'), {
            target: {
                value: newValues.logo,
            },
        });
        fireEvent.change(getByLabelText('Website'), {
            target: {
                value: newValues.website,
            },
        });
        fireEvent.click(getByText('Save'));
        expect(api.createManufacturer).toHaveBeenCalled();
        const savedManufacturer = api.createManufacturer.mock.calls[0][0];
        const submittedValues = savedManufacturer.getProperties(...Object.keys(newValues));
        expect(submittedValues).toStrictEqual(newValues);
    });
    it('can mark a manufacturers invoice as paid', async () => {
        expect.assertions(3);
        const { findAllByText, findByText, getByText } = renderWithTheme(<Manufacturers />);
        const [payButton] = await findAllByText('Pay Invoice');
        fireEvent.click(payButton);
        expect(
            await findByText('Are you sure you want to mark the Revolution invoice as paid?')
        ).toBeDefined();

        fireEvent.click(getByText('Confirm'));
        expect(api.payManufacturerInvoice).toHaveBeenCalled();
        const savedManufacturer = api.payManufacturerInvoice.mock.calls[0][0];
        expect(savedManufacturer.get('id')).toStrictEqual('0');
    });
});
