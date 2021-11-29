import { useState } from 'react';
import PropTypes from 'prop-types';
import api from '../../../api/KitePaintApi';

const ManufacturersEditData = ({ children, onSubmit }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function submit(manufacturer) {
        setIsSubmitting(true);
        try {
            await api.createManufacturer(manufacturer);
        } catch {
            setIsSubmitting(false);
            return;
        }
        onSubmit();
    }

    return children({
        submit,
        isSubmitting,
    });
};

ManufacturersEditData.propTypes = {
    children: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default ManufacturersEditData;
