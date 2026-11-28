import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { TableCell, TableRow, TextButton } from 'react-watty-ui';
import getDesignViewUrl from '../../constants/getDesignViewUrl';
import Design, { formatNameWithId } from '../../models/Design';

const ViewLink = styled(TextButton)`
    margin-left: 12px;
    text-decoration: none;
`;

// Private designs can't be seen on the public site, so they don't get a view link.
const VIEWABLE_STATUSES = ['Public', 'Unlisted'];

const DesignsRow = ({ design, onEdit, showUpdated, showCreated }) => (
    <TableRow data-testid="design-row">
        <TableCell>{design.get('id')}</TableCell>
        <TableCell>{design.get('name')}</TableCell>
        {showUpdated && <TableCell>{design.get('updated')}</TableCell>}
        {showCreated && <TableCell>{design.get('created')}</TableCell>}
        <TableCell>{design.get('status')}</TableCell>
        <TableCell>{formatNameWithId(design.get('username'), design.get('user'))}</TableCell>
        <TableCell>{formatNameWithId(design.get('productName'), design.get('product'))}</TableCell>
        <TableCell>{design.get('active') ? 'True' : 'False'}</TableCell>
        <TableCell>
            <TextButton onClick={() => onEdit(design)}>Edit</TextButton>
            {VIEWABLE_STATUSES.includes(design.get('status')) && (
                <ViewLink
                    as="a"
                    data-testid="view-link"
                    href={getDesignViewUrl(design.get('id'))}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    View
                </ViewLink>
            )}
        </TableCell>
    </TableRow>
);

DesignsRow.propTypes = {
    design: PropTypes.instanceOf(Design).isRequired,
    onEdit: PropTypes.func.isRequired,
    /** Whether to show the Updated column */
    showUpdated: PropTypes.bool,
    /** Whether to show the Created column */
    showCreated: PropTypes.bool,
};

DesignsRow.defaultProps = {
    showUpdated: true,
    showCreated: true,
};

export default DesignsRow;
