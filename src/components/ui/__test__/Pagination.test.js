import React from 'react';
import { fireEvent } from '@testing-library/react';
import Pagination, { getPageItems } from '../Pagination';

describe('getPageItems', () => {
    it('shows every page when there are few', () => {
        expect(getPageItems(1, 3)).toStrictEqual([1, 2, 3]);
    });
    it('collapses gaps into ellipses', () => {
        expect(getPageItems(10, 20)).toStrictEqual([1, null, 9, 10, 11, null, 20]);
    });
    it('shows a single missing page instead of an ellipsis', () => {
        expect(getPageItems(4, 6)).toStrictEqual([1, 2, 3, 4, 5, 6]);
    });
});

describe('Pagination', () => {
    const defaultProps = { page: 2, totalPages: 5, total: 450, pageSize: 100, onChange: jest.fn() };
    beforeEach(() => {
        defaultProps.onChange.mockClear();
    });

    it('renders nothing when there is one page', () => {
        const { queryByTestId } = renderWithTheme(
            <Pagination {...defaultProps} totalPages={1} total={50} />
        );
        expect(queryByTestId('pagination')).toBeNull();
    });

    it('shows which designs are visible', () => {
        const { getByTestId } = renderWithTheme(<Pagination {...defaultProps} />);
        expect(getByTestId('pagination-summary')).toHaveTextContent('Showing 101-200 of 450');
    });

    it('caps the summary at the total on the last page', () => {
        const { getByTestId } = renderWithTheme(<Pagination {...defaultProps} page={5} />);
        expect(getByTestId('pagination-summary')).toHaveTextContent('Showing 401-450 of 450');
    });

    it('goes to the previous and next pages', () => {
        const { getByLabelText } = renderWithTheme(<Pagination {...defaultProps} />);
        fireEvent.click(getByLabelText('Previous page'));
        fireEvent.click(getByLabelText('Next page'));
        expect(defaultProps.onChange).toHaveBeenNthCalledWith(1, 1);
        expect(defaultProps.onChange).toHaveBeenNthCalledWith(2, 3);
    });

    it('goes to a numbered page', () => {
        const { getByLabelText } = renderWithTheme(<Pagination {...defaultProps} />);
        fireEvent.click(getByLabelText('Page 5'));
        expect(defaultProps.onChange).toHaveBeenCalledWith(5);
    });

    it('does not reload the current page', () => {
        const { getByLabelText } = renderWithTheme(<Pagination {...defaultProps} />);
        fireEvent.click(getByLabelText('Page 2'));
        expect(defaultProps.onChange).not.toHaveBeenCalled();
    });

    it('disables previous on the first page and next on the last', () => {
        const first = renderWithTheme(<Pagination {...defaultProps} page={1} />);
        expect(first.getByLabelText('Previous page')).toBeDisabled();
        first.unmount();
        const last = renderWithTheme(<Pagination {...defaultProps} page={5} />);
        expect(last.getByLabelText('Next page')).toBeDisabled();
    });
});
