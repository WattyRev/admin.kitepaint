import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalClose, Label, Input, Select, Button } from 'react-watty-ui';
import Design, { DESIGN_STATUSES } from '../../models/Design';
import DesignsEditData from './edit/Data';

const DesignsEdit = ({ design, onClose, onSubmit }) => (
    <Modal isOpen={design !== null} onBackdropClick={onClose}>
        {design && (
            <DesignsEditData
                design={design}
                onSubmit={() => {
                    onSubmit();
                    onClose();
                }}
            >
                {({ editedDesign, setEditedDesign, submit, isSubmitting }) => (
                    <form
                        data-testid="design-form"
                        onSubmit={e => {
                            e.preventDefault();
                            if (!isSubmitting) {
                                submit();
                            }
                        }}
                    >
                        <ModalClose data-testid="close-modal" onClick={onClose} />
                        <Label>ID</Label>
                        <Input readOnly value={editedDesign.get('id')} />
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={editedDesign.get('name')}
                            onChange={e =>
                                setEditedDesign(editedDesign.set('name', e.target.value))
                            }
                        />
                        <Label>Updated</Label>
                        <Input readOnly value={editedDesign.get('updated')} />
                        <Label>Created</Label>
                        <Input readOnly value={editedDesign.get('created')} />
                        <Label htmlFor="status">Status</Label>
                        <Select
                            id="status"
                            value={editedDesign.get('status')}
                            onChange={e =>
                                setEditedDesign(editedDesign.set('status', e.target.value))
                            }
                        >
                            {DESIGN_STATUSES.map(status => (
                                <option value={status} key={status}>
                                    {status}
                                </option>
                            ))}
                        </Select>
                        <Label htmlFor="user">User ID</Label>
                        <Input
                            id="user"
                            value={editedDesign.get('user')}
                            onChange={e =>
                                setEditedDesign(editedDesign.set('user', e.target.value))
                            }
                        />
                        <Label>Product ID</Label>
                        <Input readOnly value={editedDesign.get('product')} />
                        <Label htmlFor="active">Active</Label>
                        <Select
                            id="active"
                            value={editedDesign.get('active')?.toString() || ''}
                            onChange={e =>
                                setEditedDesign(
                                    editedDesign.set('active', e.target.value === 'true')
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
            </DesignsEditData>
        )}
    </Modal>
);

DesignsEdit.propTypes = {
    /** The design being edited */
    design: PropTypes.instanceOf(Design),
    /** Called when the user is done editing */
    onClose: PropTypes.func.isRequired,
    /** Called when the design has been saved */
    onSubmit: PropTypes.func.isRequired,
};

DesignsEdit.defaultProps = {
    design: null,
};

export default DesignsEdit;
