import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalClose, Label, Input, Select, Button } from 'react-watty-ui';
import Product, { PRODUCT_STATUSES } from '../../models/Product';
import ProductsEditData from './edit/Data';

const ProductsEdit = ({ product, onClose, onSubmit }) => (
    <Modal isOpen={product !== null} onBackdropClick={onClose}>
        {product && (
            <ProductsEditData
                product={product}
                onSubmit={() => {
                    onSubmit();
                    onClose();
                }}
            >
                {({ editedProduct, setEditedProduct, submit, isSubmitting }) => (
                    <form
                        data-testid="product-form"
                        onSubmit={e => {
                            e.preventDefault();
                            if (!isSubmitting) {
                                submit();
                            }
                        }}
                    >
                        <ModalClose data-testid="close-modal" onClick={onClose} />
                        <Label>ID</Label>
                        <Input readOnly value={editedProduct.get('id')} />
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={editedProduct.get('name')}
                            onChange={e =>
                                setEditedProduct(editedProduct.set('name', e.target.value))
                            }
                        />
                        <Label htmlFor="status">Status</Label>
                        <Select
                            id="status"
                            value={editedProduct.get('status')}
                            onChange={e =>
                                setEditedProduct(editedProduct.set('status', e.target.value))
                            }
                        >
                            {PRODUCT_STATUSES.map(status => (
                                <option value={status} key={status}>
                                    {status}
                                </option>
                            ))}
                        </Select>
                        <Button type="submit" isPrimary disabled={isSubmitting}>
                            Save
                        </Button>
                    </form>
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
