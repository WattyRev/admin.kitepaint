import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Manufacturer from '../../models/Manufacturer';
import DirtyReporter from '../ui/DirtyReporter';
import DismissibleModal from '../ui/DismissibleModal';
import isModelDirty from '../ui/isModelDirty';
import ManufacturersEditData from './edit/Data';
import ManufacturersForm from './Form';

const ManufacturersEdit = ({ manufacturer, onClose, onSubmit }) => {
    const [isDirty, setIsDirty] = useState(false);
    return (
        <DismissibleModal isOpen={manufacturer !== null} isDirty={isDirty} onClose={onClose}>
            {manufacturer && (
                <ManufacturersEditData
                    manufacturer={manufacturer}
                    onSubmit={() => {
                        onSubmit();
                        onClose();
                    }}
                >
                    {({ editedManufacturer, setEditedManufacturer, submit, isSubmitting }) => (
                        <React.Fragment>
                            <DirtyReporter
                                isDirty={isModelDirty(manufacturer, editedManufacturer)}
                                onChange={setIsDirty}
                            />
                            <ManufacturersForm
                                manufacturer={editedManufacturer}
                                onManufacturerUpdate={setEditedManufacturer}
                                onSubmit={submit}
                                isSubmitting={isSubmitting}
                            />
                        </React.Fragment>
                    )}
                </ManufacturersEditData>
            )}
        </DismissibleModal>
    );
};

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
