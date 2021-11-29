import React from 'react';
import PropTypes from 'prop-types';
import { Label, Input, Button } from 'react-watty-ui';
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
            </React.Fragment>
        )}
        <Label htmlFor="name">Name</Label>
        <Input
            id="name"
            value={manufacturer.get('name') || ''}
            onChange={e => onManufacturerUpdate(manufacturer.set('name', e.target.value))}
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
