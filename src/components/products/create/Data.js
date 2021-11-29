import { useState } from 'react';
import PropTypes from 'prop-types';
import api from '../../../api/KitePaintApi';

const ProductsEditData = ({ children, onSubmit }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function submit(product) {
        setIsSubmitting(true);
        try {
            await api.updateProduct(product);
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

ProductsEditData.propTypes = {
    children: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default ProductsEditData;
