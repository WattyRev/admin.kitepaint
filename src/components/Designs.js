import React, { useState } from 'react';
import styled from 'styled-components';
import {
    PageLoader,
    Table,
    TableCell,
    TableHeading,
    TableRow,
    Select,
    Input,
    H1,
    Spacer,
    TextButton,
} from 'react-watty-ui';
import PageWrapper from './ui/PageWrapper';
import SearchWrapper from './ui/SearchWrapper';
import { formatNameWithId } from '../models/Design';
import DesignsData from './designs/Data';
import DesignsEdit from './designs/Edit';
import Pagination from './ui/Pagination';

const SortButton = styled(TextButton)`
    font-weight: inherit;
    color: inherit;
`;

const Designs = () => {
    const [editedDesign, setEditedDesign] = useState(null);
    return (
        <PageWrapper>
            <H1>Designs</H1>
            <Spacer bottom="md" as="div" />
            <DesignsData>
                {({
                    designs,
                    isLoading,
                    searchTerm,
                    setSearchTerm,
                    searchCriteria,
                    search,
                    refresh,
                    sortBy,
                    sortDirection,
                    sort,
                    page,
                    pageSize,
                    total,
                    totalPages,
                    setPage,
                }) => {
                    const renderSortableHeading = (column, label) => {
                        const isActive = sortBy === column;
                        let ariaSort = 'none';
                        if (isActive) {
                            ariaSort = sortDirection === 'ASC' ? 'ascending' : 'descending';
                        }
                        let indicator = '';
                        if (isActive) {
                            indicator = sortDirection === 'ASC' ? ' \u25B2' : ' \u25BC';
                        }
                        return (
                            <TableHeading aria-sort={ariaSort}>
                                <SortButton
                                    type="button"
                                    data-testid={`sort-${column}`}
                                    onClick={() => sort(column)}
                                >
                                    {label}
                                    {indicator}
                                </SortButton>
                            </TableHeading>
                        );
                    };
                    return (
                        <React.Fragment>
                            <SearchWrapper>
                                <Select
                                    data-testid="search-criteria"
                                    value={searchCriteria}
                                    onChange={e => search(e.target.value, searchTerm)}
                                >
                                    <option>Search By</option>
                                    <option value="id">ID</option>
                                    <option value="name">Name</option>
                                    <option value="user">User ID</option>
                                    <option value="username">User Name</option>
                                    <option value="product">Product ID</option>
                                    <option value="product_name">Product Name</option>
                                </Select>
                                <Input
                                    data-testid="search-term"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    onBlur={e => search(searchCriteria, e.target.value)}
                                    placeholder="Search"
                                />
                            </SearchWrapper>
                            {isLoading && <PageLoader data-testid="loading" />}
                            {!isLoading && (
                                <Table data-testid="data-table">
                                    <thead>
                                        <TableRow>
                                            <TableHeading>ID</TableHeading>
                                            {renderSortableHeading('name', 'Name')}
                                            {renderSortableHeading('updated', 'Updated')}
                                            {renderSortableHeading('created', 'Created')}
                                            <TableHeading>Status</TableHeading>
                                            <TableHeading>User</TableHeading>
                                            <TableHeading>Product</TableHeading>
                                            <TableHeading>Active</TableHeading>
                                            <TableHeading />
                                        </TableRow>
                                    </thead>
                                    <tbody>
                                        {designs.map(design => (
                                            <TableRow
                                                data-testid="design-row"
                                                key={design.get('id')}
                                            >
                                                <TableCell>{design.get('id')}</TableCell>
                                                <TableCell>{design.get('name')}</TableCell>
                                                <TableCell>{design.get('updated')}</TableCell>
                                                <TableCell>{design.get('created')}</TableCell>
                                                <TableCell>{design.get('status')}</TableCell>
                                                <TableCell>
                                                    {formatNameWithId(
                                                        design.get('username'),
                                                        design.get('user')
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {formatNameWithId(
                                                        design.get('productName'),
                                                        design.get('product')
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {design.get('active') ? 'True' : 'False'}
                                                </TableCell>
                                                <TableCell>
                                                    <TextButton
                                                        onClick={() => setEditedDesign(design)}
                                                    >
                                                        Edit
                                                    </TextButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                            <Pagination
                                page={page}
                                totalPages={totalPages}
                                total={total}
                                pageSize={pageSize}
                                onChange={setPage}
                            />
                            <DesignsEdit
                                design={editedDesign}
                                onClose={() => setEditedDesign(null)}
                                onSubmit={() => refresh()}
                            />
                        </React.Fragment>
                    );
                }}
            </DesignsData>
        </PageWrapper>
    );
};

export default Designs;
