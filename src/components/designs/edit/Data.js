import { useState } from 'react';
import PropTypes from 'prop-types';
import api from '../../../api/KitePaintApi';
import Design from '../../../models/Design';

const DesignsEditData = ({ children, design, onSubmit }) => {
    const [editedDesign, setEditedDesign] = useState(design);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function submit() {
        setIsSubmitting(true);
        try {
            await api.submitDesign(editedDesign);
        } catch {
            setIsSubmitting(false);
            return;
        }
        onSubmit();
    }

    return children({
        editedDesign,
        setEditedDesign,
        submit,
        isSubmitting,
    });
};

DesignsEditData.propTypes = {
    children: PropTypes.func.isRequired,
    design: PropTypes.instanceOf(Design).isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default DesignsEditData;
