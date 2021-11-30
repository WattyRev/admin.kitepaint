import { createModel } from 'manikin-model';
import PropTypes from 'prop-types';

export const PRODUCT_STATUSES = ['Private', 'Unlisted', 'Public'];

const Product = createModel('Product', {
    id: null,
    colors: [],
    created: '',
    embed: '',
    manufacturer: '',
    name: '',
    notes: [],
    status: 'Private',
    url: '',
    variations: [],

    buildPayload() {
        return {
            ...this.getProperties('id', 'embed', 'manufacturer', 'name', 'url'),
            variations: JSON.stringify(this.get('variations')),
            colors: JSON.stringify(this.get('colors')),
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
    manufacturer: PropTypes.string,
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
    const { id, colors, created, embed, manufacturer, status, name, notes, url, variations } =
        rawProduct;
    return new Product({
        id,
        colors: JSON.parse(colors),
        created,
        embed,
        manufacturer,
        status: PRODUCT_STATUSES[parseInt(status, 10)],
        name,
        notes: JSON.parse(notes),
        url,
        variations,
    });
}
