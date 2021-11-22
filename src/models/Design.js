import { createModel } from 'manikin-model';
import PropTypes from 'prop-types';

export const DesignStatuses = ['Private', 'Unlisted', 'Public'];

const Design = createModel('Design', {
    id: null,
    active: null,
    created: null,
    user: null,
    status: null,
    name: null,
    product: null,
    updated: null,
});

Design.prototype.propTypes = {
    id: PropTypes.string,
    active: PropTypes.bool,
    created: PropTypes.string,
    user: PropTypes.string,
    status: PropTypes.oneOf(DesignStatuses),
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
        status: DesignStatuses[parseInt(status, 10)],
        name,
        product,
        updated,
    });
}
