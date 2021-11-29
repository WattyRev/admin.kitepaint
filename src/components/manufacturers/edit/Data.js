import { useState } from 'react';
import PropTypes from 'prop-types';
import api from '../../../api/KitePaintApi';
import Manufacturer from '../../../models/Manufacturer';

const ManufacturersEditData = ({ children, manufacturer, onSubmit }) => {
    const [editedManufacturer, setEditedManufacturer] = useState(manufacturer);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function submit() {
        setIsSubmitting(true);
        try {
            await api.updateManufacturer(editedManufacturer);
        } catch {
            setIsSubmitting(false);
            return;
        }
        onSubmit();
    }

    async function payInvoice() {
        setIsSubmitting(true);
        try {
            await api.payManufacturerInvoice(manufacturer);
        } catch {
            setIsSubmitting(false);
            return;
        }
        onSubmit();
    }

    return children({
        payInvoice,
        editedManufacturer,
        setEditedManufacturer,
        submit,
        isSubmitting,
    });
};

ManufacturersEditData.propTypes = {
    children: PropTypes.func.isRequired,
    manufacturer: PropTypes.instanceOf(Manufacturer).isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default ManufacturersEditData;
