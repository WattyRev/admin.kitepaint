import { createModel } from 'manikin-model';
import PropTypes from 'prop-types';

export const DESIGN_STATUSES = ['Private', 'Unlisted', 'Public'];

/**
 * Formats a name and id like "Void (12)". Falls back to just the id when there is no name, and to
 * an empty string when there is neither.
 */
export function formatNameWithId(name, id) {
    const hasId = id !== null && id !== undefined && id !== '';
    if (!name) {
        return hasId ? String(id) : '';
    }
    return hasId ? `${name} (${id})` : name;
}

const Design = createModel('Design', {
    id: null,
    active: null,
    created: null,
    user: null,
    username: null,
    status: null,
    name: null,
    product: null,
    productName: null,
    updated: null,

    buildPayload() {
        return {
            ...this.getProperties('id', 'user', 'name'),
            active: this.get('active') ? 'true' : 'false',
            status: DESIGN_STATUSES.indexOf(this.get('status')),
        };
    },
});

Design.prototype.propTypes = {
    id: PropTypes.string,
    active: PropTypes.bool,
    created: PropTypes.string,
    user: PropTypes.string,
    username: PropTypes.string,
    status: PropTypes.oneOf(DESIGN_STATUSES),
    name: PropTypes.string,
    product: PropTypes.string,
    productName: PropTypes.string,
    updated: PropTypes.string,
};

export default Design;

export function transformDesign(rawDesign) {
    const {
        id,
        active,
        created,
        user,
        username,
        status,
        name,
        product,
        product_name: productName,
        updated,
    } = rawDesign;
    return new Design({
        id,
        active: active === '1',
        created,
        user,
        username,
        status: DESIGN_STATUSES[parseInt(status, 10)],
        name,
        product,
        productName,
        updated,
    });
}
