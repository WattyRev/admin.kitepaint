import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Product from '../../models/Product';
import DismissibleModal from '../ui/DismissibleModal';
import isModelDirty from '../ui/isModelDirty';
import ProductsCreateData from './create/Data';
import ProductsForm from './Form';
import WideModalStyle from './WideModalStyle';

const ProductsCreate = ({ isOpen, onClose, onSubmit }) => {
    const [product, setProduct] = useState(new Product());
    return (
        <DismissibleModal
            isOpen={isOpen}
            isDirty={isModelDirty(new Product(), product)}
            onClose={() => {
                setProduct(new Product());
                onClose();
            }}
        >
            {isOpen && <WideModalStyle />}
            {isOpen && (
                <ProductsCreateData
                    onSubmit={() => {
                        onSubmit();
                        setProduct(new Product());
                        onClose();
                    }}
                >
                    {({ submit, isSubmitting }) => (
                        <ProductsForm
                            product={product}
                            onProductUpdate={setProduct}
                            onSubmit={submit}
                            isSubmitting={isSubmitting}
                        />
                    )}
                </ProductsCreateData>
            )}
        </DismissibleModal>
    );
};

ProductsCreate.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    /** Called when the user is done editing */
    onClose: PropTypes.func.isRequired,
    /** Called when the product has been saved */
    onSubmit: PropTypes.func.isRequired,
};

export default ProductsCreate;
