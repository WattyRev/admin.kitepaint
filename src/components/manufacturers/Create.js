import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalClose } from 'react-watty-ui';
import Manufacturer from '../../models/Manufacturer';
import ManufacturersCreateData from './create/Data';
import ManufacturersForm from './Form';

const ManufacturersCreate = ({ isOpen, onClose, onSubmit }) => {
    const [manufacturer, setManufacturer] = useState(new Manufacturer());
    return (
        <Modal isOpen={isOpen} onBackdropClick={onClose}>
            <ModalClose data-testid="close-modal" onClick={onClose} />
            {isOpen && (
                <ManufacturersCreateData
                    onSubmit={() => {
                        onSubmit();
                        setManufacturer(new Manufacturer());
                        onClose();
                    }}
                >
                    {({ submit, isSubmitting }) => (
                        <ManufacturersForm
                            manufacturer={manufacturer}
                            onManufacturerUpdate={setManufacturer}
                            onSubmit={submit}
                            isSubmitting={isSubmitting}
                        />
                    )}
                </ManufacturersCreateData>
            )}
        </Modal>
    );
};

ManufacturersCreate.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    /** Called when the user is done editing */
    onClose: PropTypes.func.isRequired,
    /** Called when the manufacturer has been saved */
    onSubmit: PropTypes.func.isRequired,
};

export default ManufacturersCreate;
