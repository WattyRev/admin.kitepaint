import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalClose } from 'react-watty-ui';

export const DISCARD_MESSAGE = 'You have unsaved changes. Discard them?';

/**
 * A Modal that can be closed with the X button, by clicking outside of it, or by pressing Escape.
 * If there are unsaved changes, the user is asked to confirm before the modal closes.
 *
 * react-watty-ui's Modal covers its own backdrop with a full screen wrapper, so onBackdropClick
 * never fires. Instead, we listen for clicks that land directly on that wrapper.
 */
const DismissibleModal = ({ isOpen, isDirty, onClose, children }) => {
    const contentRef = useRef(null);
    const latest = useRef({ isDirty, onClose });
    latest.current = { isDirty, onClose };

    const requestClose = () => {
        // eslint-disable-next-line no-alert
        if (latest.current.isDirty && !window.confirm(DISCARD_MESSAGE)) {
            return;
        }
        latest.current.onClose();
    };

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }
        const handleMouseDown = e => {
            const modalElement = contentRef.current && contentRef.current.closest('.testing_modal');
            const wrapperElement = modalElement && modalElement.parentElement;
            const isBackdrop =
                e.target === wrapperElement ||
                (e.target.classList && e.target.classList.contains('testing_backdrop'));
            if (isBackdrop) {
                requestClose();
            }
        };
        const handleKeyDown = e => {
            if (e.key === 'Escape') {
                requestClose();
            }
        };
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} onBackdropClick={requestClose}>
            <div ref={contentRef}>
                <ModalClose data-testid="close-modal" onClick={requestClose} />
                {children}
            </div>
        </Modal>
    );
};

DismissibleModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    /** If true, the user must confirm before the modal closes */
    isDirty: PropTypes.bool,
    /** Called when the modal should close */
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node,
};

DismissibleModal.defaultProps = {
    isDirty: false,
    children: null,
};

export default DismissibleModal;
