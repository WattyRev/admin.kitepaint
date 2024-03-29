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
import DesignsData from './designs/Data';
import DesignsEdit from './designs/Edit';

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
                }) => (
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
                                <option value="product">Product ID</option>
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
                                        <TableHeading>Name</TableHeading>
                                        <TableHeading>Updated</TableHeading>
                                        <TableHeading>Created</TableHeading>
                                        <TableHeading>Status</TableHeading>
                                        <TableHeading>User ID</TableHeading>
                                        <TableHeading>Product ID</TableHeading>
                                        <TableHeading>Active</TableHeading>
                                        <TableHeading />
                                    </TableRow>
                                </thead>
                                <tbody>
                                    {designs.map(design => (
                                        <TableRow data-testid="design-row" key={design.get('id')}>
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
                                            <TableCell>
                                                <TextButton onClick={() => setEditedDesign(design)}>
                                                    Edit
                                                </TextButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                        <DesignsEdit
                            design={editedDesign}
                            onClose={() => setEditedDesign(null)}
                            onSubmit={() => refresh()}
                        />
                    </React.Fragment>
                )}
            </DesignsData>
        </PageWrapper>
    );
};

export default Designs;
