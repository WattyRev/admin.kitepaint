import React from 'react';
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
} from 'react-watty-ui';
import PageWrapper from './ui/PageWrapper';
import SearchWrapper from './ui/SearchWrapper';
import DesignsData from './designs/Data';

const Designs = () => (
    <PageWrapper>
        <H1>Designs</H1>
        <Spacer bottom="md" as="div" />
        <DesignsData>
            {({ designs, isLoading, searchTerm, setSearchTerm, searchCriteria, search }) => (
                <React.Fragment>
                    <SearchWrapper>
                        <Select
                            value={searchCriteria}
                            onChange={e => search(e.target.value, searchTerm)}
                        >
                            <option>Search By</option>
                            <option value="id">ID</option>
                            <option value="name">Name</option>
                            <option value="user">User ID</option>
                            <option value="product">Product ID</option>
                        </Select>
                        <Input
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            onBlur={e => search(searchCriteria, e.target.value)}
                            placeholder="Search"
                        />
                    </SearchWrapper>
                    {isLoading && <PageLoader />}
                    {!isLoading && (
                        <Table>
                            <thead>
                                <TableRow>
                                    <TableHeading>ID</TableHeading>
                                    <TableHeading>Name</TableHeading>
                                    <TableHeading>Updated</TableHeading>
                                    <TableHeading>Created</TableHeading>
                                    <TableHeading>Status</TableHeading>
                                    <TableHeading>User ID</TableHeading>
                                    <TableHeading>Product ID</TableHeading>
                                    <TableHeading>Active</TableHeading>
                                </TableRow>
                            </thead>
                            <tbody>
                                {designs.map(design => (
                                    <TableRow key={design.get('id')}>
                                        <TableCell>{design.get('id')}</TableCell>
                                        <TableCell>{design.get('name')}</TableCell>
                                        <TableCell>{design.get('updated')}</TableCell>
                                        <TableCell>{design.get('created')}</TableCell>
                                        <TableCell>{design.get('status')}</TableCell>
                                        <TableCell>{design.get('user')}</TableCell>
                                        <TableCell>{design.get('product')}</TableCell>
                                        <TableCell>
                                            {design.get('active') ? 'True' : 'False'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </React.Fragment>
            )}
        </DesignsData>
    </PageWrapper>
);

export default Designs;
