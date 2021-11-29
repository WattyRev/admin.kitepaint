import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalClose } from 'react-watty-ui';
import Manufacturer from '../../models/Manufacturer';
import ManufacturersEditData from './edit/Data';
import ManufacturersForm from './Form';

const ManufacturersEdit = ({ manufacturer, onClose, onSubmit }) => (
    <Modal isOpen={manufacturer !== null} onBackdropClick={onClose}>
        <ModalClose data-testid="close-modal" onClick={onClose} />
        {manufacturer && (
            <ManufacturersEditData
                manufacturer={manufacturer}
                onSubmit={() => {
                    onSubmit();
                    onClose();
                }}
            >
                {({ editedManufacturer, setEditedManufacturer, submit, isSubmitting }) => (
                    <ManufacturersForm
                        manufacturer={editedManufacturer}
                        onManufacturerUpdate={setEditedManufacturer}
                        onSubmit={submit}
                        isSubmitting={isSubmitting}
                    />
                )}
            </ManufacturersEditData>
        )}
    </Modal>
);

ManufacturersEdit.propTypes = {
    /** The manufacturer being edited */
    manufacturer: PropTypes.instanceOf(Manufacturer),
    /** Called when the user is done editing */
    onClose: PropTypes.func.isRequired,
    /** Called when the manufacturer has been saved */
    onSubmit: PropTypes.func.isRequired,
};

ManufacturersEdit.defaultProps = {
    manufacturer: null,
};

export default ManufacturersEdit;
