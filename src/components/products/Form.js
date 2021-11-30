import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Label, Input, Select, Button } from 'react-watty-ui';
import Product, { PRODUCT_STATUSES } from '../../models/Product';
import ColorsField from './ColorsField';
import VariationsField from './VariationsField';

const Flex = styled.div`
    display: flex;
`;

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
            </React.Fragment>
        )}

        <Label htmlFor="name">Name</Label>
        <Input
            id="name"
            value={product.get('name') || ''}
            onChange={e => onProductUpdate(product.set('name', e.target.value))}
            required
        />

        <Label htmlFor="manufacturer">Manufacturer</Label>
        <Input
            id="manufacturer"
            value={product.get('manufacturer') || ''}
            onChange={e => onProductUpdate(product.set('manufacturer', e.target.value))}
            required
        />

        <Label htmlFor="url">URL</Label>
        <Input
            id="url"
            type="url"
            value={product.get('url') || ''}
            onChange={e => onProductUpdate(product.set('url', e.target.value))}
        />

        <Label htmlFor="embed">Embed Domains</Label>
        <Input
            id="embed"
            value={product.get('embed') || ''}
            onChange={e => onProductUpdate(product.set('embed', e.target.value))}
        />

        <Label>Colors</Label>
        <ColorsField
            colors={product.get('colors')}
            onChange={newColors => onProductUpdate(product.set('colors', newColors))}
        />

        <Label>Variations</Label>
        <VariationsField
            variations={product.get('variations')}
            onChange={newVariations => onProductUpdate(product.set('variations', newVariations))}
        />

        <Label>Notes</Label>
        {product.get('notes').map((note, index) => (
            <Flex key={index}>
                <Button
                    type="button"
                    onClick={() => {
                        const notes = product.get('notes');
                        notes.splice(index, 1);
                        onProductUpdate(product.set('notes', notes));
                    }}
                >
                    X
                </Button>
                <Input
                    placeholder="Note"
                    value={note}
                    onChange={e => {
                        const notes = product.get('notes');
                        notes[index] = e.target.value;
                        onProductUpdate(product.set('notes', notes));
                    }}
                />
            </Flex>
        ))}
        <Button
            type="button"
            onClick={() => onProductUpdate(product.set('notes', [...product.get('notes'), '']))}
        >
            Add
        </Button>

        <br />

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
