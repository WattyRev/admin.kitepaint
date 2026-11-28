import { useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Renders nothing. Reports whether a form that lives deeper in the tree has unsaved changes to
 * a parent that can't see its state. Reports false again when unmounted.
 */
const DirtyReporter = ({ isDirty, onChange }) => {
    useEffect(() => {
        onChange(isDirty);
    }, [isDirty]);
    useEffect(() => () => onChange(false), []);
    return null;
};

DirtyReporter.propTypes = {
    isDirty: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default DirtyReporter;
