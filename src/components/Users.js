import React, { useState } from 'react';
import styled from 'styled-components';
import {
    PageLoader,
    Table,
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
import Pagination from './ui/Pagination';
import UsersData from './users/Data';
import UsersEdit from './users/Edit';
import UsersRow from './users/Row';

const SortButton = styled(TextButton)`
    font-weight: inherit;
    color: inherit;
`;

const Users = () => {
    const [editedUser, setEditedUser] = useState(null);
    return (
        <PageWrapper>
            <H1>Users</H1>
            <Spacer bottom="md" as="div" />
            <UsersData>
                {({
                    users,
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
                                    <option value="loginid">ID</option>
                                    <option value="username">Username</option>
                                    <option value="email">Email</option>
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
                                            {renderSortableHeading('username', 'Username')}
                                            {renderSortableHeading('email', 'Email')}
                                            {renderSortableHeading('created', 'Created')}
                                            {renderSortableHeading('last_login', 'Last Login')}
                                            <TableHeading>Activated</TableHeading>
                                            <TableHeading />
                                            <TableHeading />
                                        </TableRow>
                                    </thead>
                                    <tbody>
                                        {users.map(user => (
                                            <UsersRow
                                                key={user.get('loginid')}
                                                user={user}
                                                onEdit={setEditedUser}
                                                onSubmit={() => refresh()}
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
                            <UsersEdit
                                user={editedUser}
                                onClose={() => setEditedUser(null)}
                                onSubmit={() => refresh()}
                            />
                        </React.Fragment>
                    );
                }}
            </UsersData>
        </PageWrapper>
    );
};

export default Users;
