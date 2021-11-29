import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalClose } from 'react-watty-ui';
import Product from '../../models/Product';
import ProductsCreateData from './create/Data';
import ProductsForm from './Form';

const ProductsCreate = ({ isOpen, onClose, onSubmit }) => {
    const [product, setProduct] = useState(new Product());
    return (
        <Modal isOpen={isOpen} onBackdropClick={onClose}>
            <ModalClose data-testid="close-modal" onClick={onClose} />
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
        </Modal>
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
