import { createModel } from 'manikin-model';
import PropTypes from 'prop-types';

const Manufacturer = createModel('Manufacturer', {
    activated: null,
    billing_email: null,
    contact_email: null,
    contact_name: null,
    contact_phone: null,
    created: null,
    id: null,
    invoice_amount: null,
    last_paid: null,
    logo: null,
    name: null,
    website: null,

    buildPayload() {
        return {
            ...this.getProperties(
                'id',
                'name',
                'contact_name',
                'contact_phone',
                'contact_email',
                'billing_email',
                'logo',
                'website'
            ),
            activated: this.get('activated') ? 'true' : 'false',
            invoice_amount: this.get('invoice_amount')?.toString() || '0',
        };
    },
});

Manufacturer.prototype.propTypes = {
    id: PropTypes.string,
    activated: PropTypes.bool,
    billing_email: PropTypes.string,
    contact_email: PropTypes.string,
    contact_name: PropTypes.string,
    contact_phone: PropTypes.string,
    created: PropTypes.string,
    invoice_amount: PropTypes.number,
    last_paid: PropTypes.string,
    logo: PropTypes.string,
    name: PropTypes.string,
    website: PropTypes.string,
};

export default Manufacturer;

export function transformManufacturer(rawManufacturer) {
    const {
        id,
        activated,
        billing_email,
        contact_email,
        contact_name,
        contact_phone,
        created,
        invoice_amount,
        last_paid,
        logo,
        name,
        website,
    } = rawManufacturer;
    return new Manufacturer({
        id,
        activated: activated === '1',
        billing_email,
        contact_email,
        contact_name,
        contact_phone,
        created,
        invoice_amount: parseInt(invoice_amount, 10) || 0,
        last_paid,
        logo,
        name,
        website,
    });
}
