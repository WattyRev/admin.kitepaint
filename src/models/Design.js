import { createModel } from 'manikin-model';
import PropTypes from 'prop-types';

export const DESIGN_STATUSES = ['Private', 'Unlisted', 'Public'];

const Design = createModel('Design', {
    id: null,
    active: null,
    created: null,
    user: null,
    status: null,
    name: null,
    product: null,
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
    status: PropTypes.oneOf(DESIGN_STATUSES),
    name: PropTypes.string,
    product: PropTypes.string,
    updated: PropTypes.string,
};

export default Design;

export function transformDesign(rawDesign) {
    const { id, active, created, user, status, name, product, updated } = rawDesign;
    return new Design({
        id,
        active: active === '1',
        created,
        user,
        status: DESIGN_STATUSES[parseInt(status, 10)],
        name,
        product,
        updated,
    });
}
