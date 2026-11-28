import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Label, Input, Select, Button } from 'react-watty-ui';
import User from '../../models/User';
import DirtyReporter from '../ui/DirtyReporter';
import DismissibleModal from '../ui/DismissibleModal';
import isModelDirty from '../ui/isModelDirty';
import UsersEditData from './edit/Data';

const UsersEdit = ({ user, onClose, onSubmit }) => {
    const [isDirty, setIsDirty] = useState(false);
    return (
        <DismissibleModal isOpen={user !== null} isDirty={isDirty} onClose={onClose}>
            {user && (
                <UsersEditData
                    user={user}
                    onSubmit={() => {
                        onSubmit();
                        onClose();
                    }}
                >
                    {({ editedUser, setEditedUser, submit, isSubmitting }) => (
                        <form
                            data-testid="user-form"
                            onSubmit={e => {
                                e.preventDefault();
                                if (!isSubmitting) {
                                    submit();
                                }
                            }}
                        >
                            <DirtyReporter
                                isDirty={isModelDirty(user, editedUser)}
                                onChange={setIsDirty}
                            />
                            <Label>ID</Label>
                            <Input readOnly value={editedUser.get('loginid')} />
                            <Label>Created</Label>
                            <Input readOnly value={editedUser.get('create_time')} />
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                required
                                value={editedUser.get('username')}
                                onChange={e =>
                                    setEditedUser(editedUser.set('username', e.target.value))
                                }
                            />
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                value={editedUser.get('email')}
                                onChange={e =>
                                    setEditedUser(editedUser.set('email', e.target.value))
                                }
                            />
                            <Label htmlFor="activated">Active</Label>
                            <Select
                                id="activated"
                                value={editedUser.get('activated')?.toString() || ''}
                                onChange={e =>
                                    setEditedUser(
                                        editedUser.set('activated', e.target.value === 'true')
                                    )
                                }
                            >
                                <option value="true">True</option>
                                <option value="false">False</option>
                            </Select>
                            <Button type="submit" isPrimary disabled={isSubmitting}>
                                Save
                            </Button>
                        </form>
                    )}
                </UsersEditData>
            )}
        </DismissibleModal>
    );
};

UsersEdit.propTypes = {
    /** The user being edited */
    user: PropTypes.instanceOf(User),
    /** Called when the user is done editing */
    onClose: PropTypes.func.isRequired,
    /** Called when the user has been saved */
    onSubmit: PropTypes.func.isRequired,
};

UsersEdit.defaultProps = {
    user: null,
};

export default UsersEdit;
