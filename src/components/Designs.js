import React, { useState } from 'react';
import styled from 'styled-components';
import {
    PageLoader,
    Table,
    TableHeading,
    TableRow,
    Select,
    H1,
    Spacer,
    TextButton,
} from 'react-watty-ui';
import PageWrapper from './ui/PageWrapper';
import SearchWrapper from './ui/SearchWrapper';
import SearchInput from './ui/SearchInput';
import DesignsData from './designs/Data';
import DesignsEdit from './designs/Edit';
import DesignsRow from './designs/Row';
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
                                    <option value="name">Name</option>
                                    <option value="id">ID</option>
                                    <option value="user">User ID</option>
                                    <option value="username">User Name</option>
                                    <option value="product">Product ID</option>
                                    <option value="product_name">Product Name</option>
                                </Select>
                                <SearchInput
                                    data-testid="search-term"
                                    value={searchTerm}
                                    onValueChange={setSearchTerm}
                                    onSearch={term => search(searchCriteria, term)}
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
                                            <DesignsRow
                                                key={design.get('id')}
                                                design={design}
                                                onEdit={setEditedDesign}
                                            />
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
