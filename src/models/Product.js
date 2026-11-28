import { createModel } from 'manikin-model';
import PropTypes from 'prop-types';

export const PRODUCT_STATUSES = ['Private', 'Unlisted', 'Public'];

/**
 * Reduces colors to only the properties that are stored in the database, so extra properties from
 * pasted JSON don't end up saved.
 * @param {Object[]} colors
 * @return {{ name: string, color: string }[]}
 */
export function sanitizeColors(colors) {
    if (!Array.isArray(colors)) {
        return [];
    }
    return colors
        .filter(color => color && typeof color === 'object')
        .map(({ name, color }) => ({
            name: typeof name === 'string' ? name : '',
            color: typeof color === 'string' ? color : '',
        }));
}

const Product = createModel('Product', {
    id: null,
    colors: [],
    created: '',
    embed: '',
    manufacturer: '',
    manufacturerName: '',
    name: '',
    notes: [],
    status: 'Private',
    url: '',
    variations: [],

    buildPayload() {
        return {
            ...this.getProperties('id', 'embed', 'manufacturer', 'name', 'url'),
            variations: JSON.stringify(this.get('variations')),
            colors: JSON.stringify(sanitizeColors(this.get('colors'))),
            notes: JSON.stringify(this.get('notes')),
            status: PRODUCT_STATUSES.indexOf(this.get('status')),
        };
    },
});

Product.prototype.propTypes = {
    id: PropTypes.string,
    colors: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            color: PropTypes.string,
        })
    ),
    created: PropTypes.string,
    /** A list of domains separated by commas */
    embed: PropTypes.string,
    /** The id of the product's manufacturer */
    manufacturer: PropTypes.string,
    /** The name of the product's manufacturer */
    manufacturerName: PropTypes.string,
    status: PropTypes.oneOf(PRODUCT_STATUSES),
    name: PropTypes.string,
    notes: PropTypes.arrayOf(PropTypes.string),
    url: PropTypes.string,
    variations: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
            sortIndex: PropTypes.number,
            svg: PropTypes.string,
        })
    ),
};

export default Product;

export function transformProduct(rawProduct) {
    const {
        id,
        colors,
        created,
        embed,
        manufacturer,
        manufacturer_name: manufacturerName,
        status,
        name,
        notes,
        url,
        variations,
    } = rawProduct;
    return new Product({
        id,
        colors: colors ? JSON.parse(colors) : [],
        created,
        embed,
        manufacturer,
        manufacturerName: manufacturerName || '',
        status: PRODUCT_STATUSES[parseInt(status, 10)],
        name,
        notes: notes ? JSON.parse(notes) : [],
        url,
        variations,
    });
}
