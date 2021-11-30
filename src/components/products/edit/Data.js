import { useState } from 'react';
import PropTypes from 'prop-types';
import api from '../../../api/KitePaintApi';
import Product from '../../../models/Product';

const ProductsEditData = ({ children, product, onSubmit }) => {
    const [editedProduct, setEditedProduct] = useState(product);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function submit() {
        setIsSubmitting(true);
        try {
            await api.updateProduct(editedProduct);
        } catch {
            setIsSubmitting(false);
            return;
        }
        onSubmit();
    }

    return children({
        editedProduct,
        setEditedProduct,
        submit,
        isSubmitting,
    });
};

ProductsEditData.propTypes = {
    children: PropTypes.func.isRequired,
    product: PropTypes.instanceOf(Product).isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default ProductsEditData;
