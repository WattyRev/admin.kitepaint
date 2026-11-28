import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Manufacturer from '../../models/Manufacturer';
import DismissibleModal from '../ui/DismissibleModal';
import isModelDirty from '../ui/isModelDirty';
import ManufacturersCreateData from './create/Data';
import ManufacturersForm from './Form';

const ManufacturersCreate = ({ isOpen, onClose, onSubmit }) => {
    const [manufacturer, setManufacturer] = useState(new Manufacturer());
    return (
        <DismissibleModal
            isOpen={isOpen}
            isDirty={isModelDirty(new Manufacturer(), manufacturer)}
            onClose={() => {
                setManufacturer(new Manufacturer());
                onClose();
            }}
        >
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
        </DismissibleModal>
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
