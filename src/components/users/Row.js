import React from 'react';
import PropTypes from 'prop-types';
import { TableCell, TableRow, TextButton, ModalConfirm } from 'react-watty-ui';
import User from '../../models/User';
import UsersEditData from './edit/Data';

const UsersRow = ({ user, onEdit, onSubmit, showDates }) => (
    <TableRow data-testid="user-row" key={user.get('loginid')}>
        <TableCell>{user.get('loginid')}</TableCell>
        <TableCell>{user.get('username')}</TableCell>
        <TableCell>{user.get('email')}</TableCell>
        {showDates && <TableCell>{user.get('create_time')}</TableCell>}
        {showDates && <TableCell>{user.get('last_login')}</TableCell>}
        <TableCell>{user.get('activated') ? 'True' : 'False'}</TableCell>
        <TableCell>
            <TextButton onClick={() => onEdit(user)}>Edit</TextButton>
        </TableCell>
        <TableCell>
            <UsersEditData user={user} onSubmit={onSubmit}>
                {({ isSubmitting, resetPassword }) => (
                    <ModalConfirm
                        onConfirm={resetPassword}
                        message={`Are you sure you want to reset the password for ${user.get(
                            'username'
                        )}?`}
                    >
                        {modalConfirm => (
                            <TextButton
                                onClick={isSubmitting ? () => {} : modalConfirm.actions.open}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Reset Password'}
                            </TextButton>
                        )}
                    </ModalConfirm>
                )}
            </UsersEditData>
        </TableCell>
    </TableRow>
);

UsersRow.propTypes = {
    user: PropTypes.instanceOf(User).isRequired,
    onEdit: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    /** Whether to show the Created and Last Login columns */
    showDates: PropTypes.bool,
};

UsersRow.defaultProps = {
    showDates: true,
};

export default UsersRow;
