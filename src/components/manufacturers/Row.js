import React from 'react';
import PropTypes from 'prop-types';
import { TableCell, TableRow, TextButton, ModalConfirm } from 'react-watty-ui';
import Manufacturer from '../../models/Manufacturer';
import ManufacturersEditData from './edit/Data';

const ManufacturersRow = ({ manufacturer, onEdit, onSubmit }) => (
    <TableRow data-testid="manufacturer-row" key={manufacturer.get('id')}>
        <TableCell>{manufacturer.get('id')}</TableCell>
        <TableCell>{manufacturer.get('name')}</TableCell>
        <TableCell>{manufacturer.get('activated') ? 'True' : 'False'}</TableCell>
        <TableCell>{manufacturer.get('created')}</TableCell>
        <TableCell>{manufacturer.get('contact_name')}</TableCell>
        <TableCell>{manufacturer.get('contact_phone')}</TableCell>
        <TableCell>{manufacturer.get('contact_email')}</TableCell>
        <TableCell>{manufacturer.get('billing_email')}</TableCell>
        <TableCell>{manufacturer.get('invoice_amount')}</TableCell>
        <TableCell>{manufacturer.get('last_paid')}</TableCell>
        <TableCell>{manufacturer.get('logo')}</TableCell>
        <TableCell>{manufacturer.get('website')}</TableCell>
        <TableCell>
            <TextButton onClick={() => onEdit(manufacturer)}>Edit</TextButton>
        </TableCell>
        <TableCell>
            <ManufacturersEditData manufacturer={manufacturer} onSubmit={onSubmit}>
                {({ isSubmitting, payInvoice }) => (
                    <ModalConfirm
                        onConfirm={payInvoice}
                        message={`Are you sure you want to mark the ${manufacturer.get(
                            'name'
                        )} invoice as paid?`}
                    >
                        {modalConfirm => (
                            <TextButton
                                onClick={isSubmitting ? () => {} : modalConfirm.actions.open}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Pay Invoice'}
                            </TextButton>
                        )}
                    </ModalConfirm>
                )}
            </ManufacturersEditData>
        </TableCell>
    </TableRow>
);

ManufacturersRow.propTypes = {
    manufacturer: PropTypes.instanceOf(Manufacturer).isRequired,
    onEdit: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default ManufacturersRow;
