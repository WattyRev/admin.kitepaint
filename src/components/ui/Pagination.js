import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Nav = styled.nav`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    margin: 16px 0;
`;

// Picks a theme color depending on whether the button is the current page.
function pick({ isCurrent, theme }, currentColor, otherColor) {
    return theme.colors[isCurrent ? currentColor : otherColor];
}

const PageButton = styled.button`
    box-sizing: border-box;
    min-width: 36px;
    margin: 4px;
    padding: 6px 10px;
    border: 0;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;
    background: ${props => pick(props, 'blue', 'silver')};
    color: ${props => pick(props, 'white', 'black')};

    &:hover:not([disabled]) {
        background: ${props => pick(props, 'blue', 'gray')};
    }

    &[disabled] {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const Ellipsis = styled.span`
    margin: 4px;
`;

const Summary = styled.div`
    width: 100%;
    text-align: center;
    margin-bottom: 8px;
`;

/**
 * Determines which page numbers to show. Always includes the first page, the last page, and the
 * pages surrounding the current page. Gaps are represented by null.
 *
 * @param {Number} page The current page
 * @param {Number} totalPages
 * @return {Array<Number|null>} e.g. [1, null, 4, 5, 6, null, 20]
 */
export const getPageItems = (page, totalPages) => {
    const pages = [];
    for (let i = 1; i <= totalPages; i += 1) {
        if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
            pages.push(i);
        }
    }
    const items = [];
    pages.forEach((value, index) => {
        if (index > 0) {
            const gap = value - pages[index - 1];
            if (gap === 2) {
                // A single missing page is shown instead of an ellipsis.
                items.push(value - 1);
            } else if (gap > 2) {
                items.push(null);
            }
        }
        items.push(value);
    });
    return items;
};

/**
 * Page navigation with previous/next buttons and numbered pages. Renders nothing when there is
 * only one page.
 */
const Pagination = ({ page, totalPages, total, pageSize, onChange }) => {
    if (totalPages <= 1) {
        return null;
    }
    const first = (page - 1) * pageSize + 1;
    const last = Math.min(page * pageSize, total);
    return (
        <Nav aria-label="Pagination" data-testid="pagination">
            <Summary data-testid="pagination-summary">
                Showing {first}-{last} of {total}
            </Summary>
            <PageButton
                type="button"
                disabled={page <= 1}
                onClick={() => onChange(page - 1)}
                aria-label="Previous page"
            >
                Previous
            </PageButton>
            {getPageItems(page, totalPages).map((item, index) => {
                if (item === null) {
                    return <Ellipsis key={`ellipsis-${index}`}>&hellip;</Ellipsis>;
                }
                return (
                    <PageButton
                        key={item}
                        type="button"
                        isCurrent={item === page}
                        aria-current={item === page ? 'page' : undefined}
                        aria-label={`Page ${item}`}
                        onClick={() => item !== page && onChange(item)}
                    >
                        {item}
                    </PageButton>
                );
            })}
            <PageButton
                type="button"
                disabled={page >= totalPages}
                onClick={() => onChange(page + 1)}
                aria-label="Next page"
            >
                Next
            </PageButton>
        </Nav>
    );
};

Pagination.propTypes = {
    /** The current (1-based) page. */
    page: PropTypes.number.isRequired,
    /** The total number of pages. */
    totalPages: PropTypes.number.isRequired,
    /** The total number of items across all pages. */
    total: PropTypes.number.isRequired,
    /** The number of items per page. */
    pageSize: PropTypes.number.isRequired,
    /** Called with the new page number. */
    onChange: PropTypes.func.isRequired,
};

export default Pagination;
