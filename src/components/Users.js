import React, { useState } from 'react';
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
import UsersData from './users/Data';
import UsersEdit from './users/Edit';

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
                }) => (
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
                                        <TableHeading>Username</TableHeading>
                                        <TableHeading>Email</TableHeading>
                                        <TableHeading>Created</TableHeading>
                                        <TableHeading>Last Login</TableHeading>
                                        <TableHeading>Activated</TableHeading>
                                        <TableHeading />
                                    </TableRow>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <TableRow data-testid="user-row" key={user.get('loginid')}>
                                            <TableCell>{user.get('loginid')}</TableCell>
                                            <TableCell>{user.get('username')}</TableCell>
                                            <TableCell>{user.get('email')}</TableCell>
                                            <TableCell>{user.get('create_time')}</TableCell>
                                            <TableCell>{user.get('last_login')}</TableCell>
                                            <TableCell>
                                                {user.get('activated') ? 'True' : 'False'}
                                            </TableCell>
                                            <TableCell>
                                                <TextButton onClick={() => setEditedUser(user)}>
                                                    Edit
                                                </TextButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                        <UsersEdit
                            user={editedUser}
                            onClose={() => setEditedUser(null)}
                            onSubmit={() => refresh()}
                        />
                    </React.Fragment>
                )}
            </UsersData>
        </PageWrapper>
    );
};

export default Users;
