import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Product from '../../models/Product';
import DirtyReporter from '../ui/DirtyReporter';
import DismissibleModal from '../ui/DismissibleModal';
import isModelDirty from '../ui/isModelDirty';
import ProductsEditData from './edit/Data';
import ProductsForm from './Form';
import WideModalStyle from './WideModalStyle';

const ProductsEdit = ({ product, onClose, onSubmit }) => {
    const [isDirty, setIsDirty] = useState(false);
    return (
        <DismissibleModal isOpen={product !== null} isDirty={isDirty} onClose={onClose}>
            {product && <WideModalStyle />}
            {product && (
                <ProductsEditData
                    product={product}
                    onSubmit={() => {
                        onSubmit();
                        onClose();
                    }}
                >
                    {({ editedProduct, setEditedProduct, submit, isSubmitting }) => (
                        <React.Fragment>
                            <DirtyReporter
                                isDirty={isModelDirty(product, editedProduct)}
                                onChange={setIsDirty}
                            />
                            <ProductsForm
                                product={editedProduct}
                                onProductUpdate={setEditedProduct}
                                onSubmit={submit}
                                isSubmitting={isSubmitting}
                            />
                        </React.Fragment>
                    )}
                </ProductsEditData>
            )}
        </DismissibleModal>
    );
};

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
