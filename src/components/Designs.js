import React from 'react';
import { PageLoader, Table, TableCell, TableHeading, TableRow } from 'react-watty-ui';
import PageWrapper from './ui/PageWrapper';
import DesignsData from './designs/Data';

const Designs = () => (
    <PageWrapper>
        <DesignsData>
            {({ designs, isLoading }) => {
                if (isLoading) {
                    return <PageLoader />;
                }
                return (
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
                                <TableRow>
                                    <TableCell>{design.get('id')}</TableCell>
                                    <TableCell>{design.get('name')}</TableCell>
                                    <TableCell>{design.get('updated')}</TableCell>
                                    <TableCell>{design.get('created')}</TableCell>
                                    <TableCell>{design.get('status')}</TableCell>
                                    <TableCell>{design.get('user')}</TableCell>
                                    <TableCell>{design.get('product')}</TableCell>
                                    <TableCell>{design.get('active') ? 'True' : 'False'}</TableCell>
                                </TableRow>
                            ))}
                        </tbody>
                    </Table>
                );
            }}
        </DesignsData>
    </PageWrapper>
);

export default Designs;
