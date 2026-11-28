import React, { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import api from '../../api/KitePaintApi';
import { formatNameWithId } from '../../models/Design';
import Lookup from '../ui/Lookup';

export const MAX_RESULTS = 20;

/** Loads the products, or resolves to null when the request fails. */
async function loadProducts() {
    try {
        return (await api.getProducts({})) || [];
    } catch {
        return null;
    }
}

/**
 * Picks a product by name. The products are loaded once, the first time the user searches, and
 * then filtered in the browser. Picking one calls `onSelect` with the full product.
 */
const ProductLookup = ({ id, onSelect, placeholder }) => {
    const products = useRef(null);

    /** Finds products by name, in the shape that Lookup expects. */
    const searchProducts = useCallback(async term => {
        if (!products.current) {
            products.current = loadProducts().then(loaded => {
                if (loaded === null) {
                    // Allow the next search to try again.
                    products.current = null;
                }
                return loaded || [];
            });
        }
        const loaded = await products.current;
        const lowerTerm = term.toLowerCase();
        return loaded
            .filter(item => (item.get('name') || '').toLowerCase().includes(lowerTerm))
            .sort((a, b) => (a.get('name') || '').localeCompare(b.get('name') || ''))
            .slice(0, MAX_RESULTS)
            .map(item => ({
                id: String(item.get('id')),
                name: item.get('name'),
                label: formatNameWithId(item.get('name'), item.get('id')),
            }));
    }, []);

    const handleSelect = async productId => {
        const loaded = await products.current;
        const product = (loaded || []).find(item => String(item.get('id')) === productId);
        if (product) {
            onSelect(product);
        }
    };

    return (
        <Lookup id={id} placeholder={placeholder} search={searchProducts} onSelect={handleSelect} />
    );
};

ProductLookup.propTypes = {
    id: PropTypes.string,
    /** Called with the picked product */
    onSelect: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
};

ProductLookup.defaultProps = {
    id: undefined,
    placeholder: 'Search by product name',
};

export default ProductLookup;
