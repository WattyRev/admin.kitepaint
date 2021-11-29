import { useState } from 'react';
import PropTypes from 'prop-types';
import api from '../../../api/KitePaintApi';
import User from '../../../models/User';

const UsersEditData = ({ children, user, onSubmit }) => {
    const [editedUser, setEditedUser] = useState(user);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function submit() {
        setIsSubmitting(true);
        try {
            await api.updateUser(editedUser);
        } catch {
            setIsSubmitting(false);
            return;
        }
        onSubmit();
    }

    async function resetPassword() {
        setIsSubmitting(true);
        try {
            await api.resetUserPassword(editedUser);
        } catch {
            setIsSubmitting(false);
            return;
        }
        onSubmit();
    }

    return children({
        editedUser,
        resetPassword,
        setEditedUser,
        submit,
        isSubmitting,
    });
};

UsersEditData.propTypes = {
    children: PropTypes.func.isRequired,
    user: PropTypes.instanceOf(User).isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default UsersEditData;
