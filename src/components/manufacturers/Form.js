import React from 'react';
import PropTypes from 'prop-types';
import { Label, Input, Button, Select } from 'react-watty-ui';
import Manufacturer from '../../models/Manufacturer';

const ManufacturersForm = ({ manufacturer, onManufacturerUpdate, onSubmit, isSubmitting }) => (
    <form
        data-testid="manufacturer-form"
        onSubmit={e => {
            e.preventDefault();
            if (!isSubmitting) {
                onSubmit(manufacturer);
            }
        }}
    >
        {manufacturer.get('id') && (
            <React.Fragment>
                <Label>ID</Label>
                <Input readOnly value={manufacturer.get('id')} />

                <Label htmlFor="activated">Activated</Label>
                <Select
                    id="activated"
                    value={manufacturer.get('activated').toString()}
                    onChange={e =>
                        onManufacturerUpdate(
                            manufacturer.set('activated', e.target.value === 'true')
                        )
                    }
                >
                    <option value="true">True</option>
                    <option value="false">False</option>
                </Select>
            </React.Fragment>
        )}

        <Label htmlFor="name">Name</Label>
        <Input
            id="name"
            value={manufacturer.get('name') || ''}
            onChange={e => onManufacturerUpdate(manufacturer.set('name', e.target.value))}
        />

        <Label htmlFor="contact_name">Contact Name</Label>
        <Input
            id="contact_name"
            value={manufacturer.get('contact_name') || ''}
            onChange={e => onManufacturerUpdate(manufacturer.set('contact_name', e.target.value))}
        />

        <Label htmlFor="contact_phone">Contact Phone</Label>
        <Input
            id="contact_phone"
            value={manufacturer.get('contact_phone') || ''}
            onChange={e => onManufacturerUpdate(manufacturer.set('contact_phone', e.target.value))}
        />

        <Label htmlFor="contact_email">Contact Email</Label>
        <Input
            id="contact_email"
            value={manufacturer.get('contact_email') || ''}
            onChange={e => onManufacturerUpdate(manufacturer.set('contact_email', e.target.value))}
        />

        <Label htmlFor="billing_email">Billing Email</Label>
        <Input
            id="billing_email"
            value={manufacturer.get('billing_email') || ''}
            onChange={e => onManufacturerUpdate(manufacturer.set('billing_email', e.target.value))}
        />

        <Label htmlFor="invoice_amount">Invoice Amount</Label>
        <Input
            type="number"
            id="invoice_amount"
            value={manufacturer.get('invoice_amount') || ''}
            onChange={e =>
                onManufacturerUpdate(manufacturer.set('invoice_amount', parseFloat(e.target.value)))
            }
        />

        <Label htmlFor="logo">Logo</Label>
        <Input
            id="logo"
            value={manufacturer.get('logo') || ''}
            onChange={e => onManufacturerUpdate(manufacturer.set('logo', e.target.value))}
        />

        <Label htmlFor="website">Website</Label>
        <Input
            id="website"
            value={manufacturer.get('website') || ''}
            onChange={e => onManufacturerUpdate(manufacturer.set('website', e.target.value))}
        />

        <Button type="submit" isPrimary disabled={isSubmitting}>
            Save
        </Button>
    </form>
);

ManufacturersForm.propTypes = {
    manufacturer: PropTypes.instanceOf(Manufacturer).isRequired,
    onManufacturerUpdate: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
};

export default ManufacturersForm;
