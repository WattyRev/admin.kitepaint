import React from 'react';
import { fireEvent } from '@testing-library/react';
import DismissibleModal from '../DismissibleModal';

describe('DismissibleModal', () => {
    let defaultProps;
    beforeEach(() => {
        defaultProps = {
            isOpen: true,
            isDirty: false,
            onClose: jest.fn(),
        };
        jest.spyOn(window, 'confirm').mockReturnValue(true);
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    const render = props =>
        renderWithTheme(
            <DismissibleModal {...defaultProps} {...props}>
                <input data-testid="content" />
            </DismissibleModal>
        );
    const getBackdropWrapper = getByTestId =>
        getByTestId('content').closest('.testing_modal').parentElement;

    describe('without changes', () => {
        it('closes immediately when X is clicked', () => {
            expect.assertions(2);
            const { getByTestId } = render();
            fireEvent.click(getByTestId('close-modal'));
            expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
            expect(window.confirm).not.toHaveBeenCalled();
        });
        it('closes immediately when the backdrop is clicked', () => {
            expect.assertions(2);
            const { getByTestId } = render();
            fireEvent.mouseDown(getBackdropWrapper(getByTestId));
            expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
            expect(window.confirm).not.toHaveBeenCalled();
        });
        it('closes immediately when Escape is pressed', () => {
            expect.assertions(2);
            render();
            fireEvent.keyDown(document, { key: 'Escape' });
            expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
            expect(window.confirm).not.toHaveBeenCalled();
        });
        it('does not close for other keys', () => {
            expect.assertions(1);
            render();
            fireEvent.keyDown(document, { key: 'Enter' });
            expect(defaultProps.onClose).not.toHaveBeenCalled();
        });
        it('does not close when the modal content is clicked', () => {
            expect.assertions(1);
            const { getByTestId } = render();
            fireEvent.mouseDown(getByTestId('content'));
            expect(defaultProps.onClose).not.toHaveBeenCalled();
        });
    });

    describe('with changes', () => {
        beforeEach(() => {
            defaultProps.isDirty = true;
        });
        it('confirms before closing from X, backdrop and Escape', () => {
            expect.assertions(2);
            const { getByTestId } = render();
            fireEvent.click(getByTestId('close-modal'));
            fireEvent.mouseDown(getBackdropWrapper(getByTestId));
            fireEvent.keyDown(document, { key: 'Escape' });
            expect(window.confirm).toHaveBeenCalledTimes(3);
            expect(defaultProps.onClose).toHaveBeenCalledTimes(3);
        });
        it('does not close if the user cancels the confirmation', () => {
            expect.assertions(2);
            window.confirm.mockReturnValue(false);
            render();
            fireEvent.keyDown(document, { key: 'Escape' });
            expect(window.confirm).toHaveBeenCalledTimes(1);
            expect(defaultProps.onClose).not.toHaveBeenCalled();
        });
    });

    describe('when closed', () => {
        it('does not respond to Escape', () => {
            expect.assertions(1);
            render({ isOpen: false });
            fireEvent.keyDown(document, { key: 'Escape' });
            expect(defaultProps.onClose).not.toHaveBeenCalled();
        });
        it('stops listening when unmounted', () => {
            expect.assertions(1);
            const { unmount } = render();
            unmount();
            fireEvent.keyDown(document, { key: 'Escape' });
            expect(defaultProps.onClose).not.toHaveBeenCalled();
        });
    });
});
