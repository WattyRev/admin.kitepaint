import React, { useState } from 'react';
import { PageLoader, Table, TableHeading, TableRow, H1, Spacer, Button } from 'react-watty-ui';
import PageWrapper from './ui/PageWrapper';
import ManufacturersData from './manufacturers/Data';
import ManufacturersEdit from './manufacturers/Edit';
import ManufacturersCreate from './manufacturers/Create';
import ManufacturersRow from './manufacturers/Row';

const Manufacturers = () => {
    const [editedManufacturer, setEditedManufacturer] = useState(null);
    const [creatingManufacturer, setCreatingManufacturer] = useState(false);
    return (
        <PageWrapper>
            <H1>Manufacturers</H1>
            <Spacer bottom="md" as="div" />
            <Button type="button" isPrimary onClick={() => setCreatingManufacturer(true)}>
                Add New Manufacturer
            </Button>
            <ManufacturersData>
                {({ manufacturers, isLoading, refresh }) => (
                    <React.Fragment>
                        {isLoading && <PageLoader data-testid="loading" />}
                        {!isLoading && (
                            <Table data-testid="data-table">
                                <thead>
                                    <TableRow>
                                        <TableHeading>ID</TableHeading>
                                        <TableHeading>Name</TableHeading>
                                        <TableHeading>Activated</TableHeading>
                                        <TableHeading>Created</TableHeading>
                                        <TableHeading>Contact Name</TableHeading>
                                        <TableHeading>Contact Phone</TableHeading>
                                        <TableHeading>Contact Email</TableHeading>
                                        <TableHeading>Billing Email</TableHeading>
                                        <TableHeading>Incoice Amount</TableHeading>
                                        <TableHeading>Last Paid</TableHeading>
                                        <TableHeading>Logo</TableHeading>
                                        <TableHeading>Website</TableHeading>
                                        <TableHeading />
                                        <TableHeading />
                                    </TableRow>
                                </thead>
                                <tbody>
                                    {manufacturers.map(manufacturer => (
                                        <ManufacturersRow
                                            key={manufacturer.get('id')}
                                            manufacturer={manufacturer}
                                            onEdit={setEditedManufacturer}
                                            onSubmit={refresh}
                                        />
                                    ))}
                                </tbody>
                            </Table>
                        )}
                        <ManufacturersEdit
                            manufacturer={editedManufacturer}
                            onClose={() => setEditedManufacturer(null)}
                            onSubmit={() => refresh()}
                        />
                        <ManufacturersCreate
                            isOpen={creatingManufacturer}
                            onClose={() => setCreatingManufacturer(false)}
                            onSubmit={() => refresh()}
                        />
                    </React.Fragment>
                )}
            </ManufacturersData>
        </PageWrapper>
    );
};

export default Manufacturers;
