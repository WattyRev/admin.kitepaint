import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalClose } from 'react-watty-ui';
import Product from '../../models/Product';
import ProductsEditData from './edit/Data';
import ProductsForm from './Form';

const ProductsEdit = ({ product, onClose, onSubmit }) => (
    <Modal isOpen={product !== null} onBackdropClick={onClose}>
        <ModalClose data-testid="close-modal" onClick={onClose} />
        {product && (
            <ProductsEditData
                product={product}
                onSubmit={() => {
                    onSubmit();
                    onClose();
                }}
            >
                {({ editedProduct, setEditedProduct, submit, isSubmitting }) => (
                    <ProductsForm
                        product={editedProduct}
                        onProductUpdate={setEditedProduct}
                        onSubmit={submit}
                        isSubmitting={isSubmitting}
                    />
                )}
            </ProductsEditData>
        )}
    </Modal>
);

ProductsEdit.propTypes = {
    /** The product being edited */
    product: PropTypes.instanceOf(Product),
    /** Called when the user is done editing */
    onClose: PropTypes.func.isRequired,
    /** Called when the product has been saved */
    onSubmit: PropTypes.func.isRequired,
};

ProductsEdit.defaultProps = {
    product: null,
};

export default ProductsEdit;
