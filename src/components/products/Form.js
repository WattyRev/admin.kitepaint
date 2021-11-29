import React from 'react';
import PropTypes from 'prop-types';
import { Label, Input, Select, Button } from 'react-watty-ui';
import Product, { PRODUCT_STATUSES } from '../../models/Product';

const ProductsForm = ({ product, onProductUpdate, onSubmit, isSubmitting }) => (
    <form
        data-testid="product-form"
        onSubmit={e => {
            e.preventDefault();
            if (!isSubmitting) {
                onSubmit(product);
            }
        }}
    >
        {product.get('id') && (
            <React.Fragment>
                <Label>ID</Label>
                <Input readOnly value={product.get('id')} />
            </React.Fragment>
        )}
        <Label htmlFor="name">Name</Label>
        <Input
            id="name"
            value={product.get('name') || ''}
            onChange={e => onProductUpdate(product.set('name', e.target.value))}
        />
        <Label htmlFor="status">Status</Label>
        <Select
            id="status"
            value={product.get('status') || ''}
            onChange={e => onProductUpdate(product.set('status', e.target.value))}
        >
            {!product.get('status') && <option>Select One</option>}
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
);

ProductsForm.propTypes = {
    product: PropTypes.instanceOf(Product).isRequired,
    onProductUpdate: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
};

export default ProductsForm;
