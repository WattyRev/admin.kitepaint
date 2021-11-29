import React, { useState } from 'react';
import {
    PageLoader,
    Table,
    TableCell,
    TableHeading,
    TableRow,
    H1,
    Spacer,
    TextButton,
    Button,
} from 'react-watty-ui';
import ManufacturersEditData from './manufacturers/edit/Data';
import PageWrapper from './ui/PageWrapper';
import ManufacturersData from './manufacturers/Data';
import ManufacturersEdit from './manufacturers/Edit';
import ManufacturersCreate from './manufacturers/Create';

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
                                        <TableRow
                                            data-testid="manufacturer-row"
                                            key={manufacturer.get('id')}
                                        >
                                            <TableCell>{manufacturer.get('id')}</TableCell>
                                            <TableCell>{manufacturer.get('name')}</TableCell>
                                            <TableCell>
                                                {manufacturer.get('activated') ? 'True' : 'False'}
                                            </TableCell>
                                            <TableCell>{manufacturer.get('created')}</TableCell>
                                            <TableCell>
                                                {manufacturer.get('contact_name')}
                                            </TableCell>
                                            <TableCell>
                                                {manufacturer.get('contact_phone')}
                                            </TableCell>
                                            <TableCell>
                                                {manufacturer.get('contact_email')}
                                            </TableCell>
                                            <TableCell>
                                                {manufacturer.get('billing_email')}
                                            </TableCell>
                                            <TableCell>
                                                {manufacturer.get('invoice_amount')}
                                            </TableCell>
                                            <TableCell>{manufacturer.get('last_paid')}</TableCell>
                                            <TableCell>{manufacturer.get('logo')}</TableCell>
                                            <TableCell>{manufacturer.get('website')}</TableCell>
                                            <TableCell>
                                                <TextButton
                                                    onClick={() =>
                                                        setEditedManufacturer(manufacturer)
                                                    }
                                                >
                                                    Edit
                                                </TextButton>
                                            </TableCell>
                                            <TableCell>
                                                <ManufacturersEditData
                                                    manufacturer={manufacturer}
                                                    onSubmit={refresh}
                                                >
                                                    {({ isSubmitting, payInvoice }) => (
                                                        <TextButton
                                                            onClick={
                                                                isSubmitting
                                                                    ? () => {}
                                                                    : () => payInvoice()
                                                            }
                                                            disabled={isSubmitting}
                                                        >
                                                            {isSubmitting
                                                                ? 'Submitting...'
                                                                : 'Pay Invoice'}
                                                        </TextButton>
                                                    )}
                                                </ManufacturersEditData>
                                            </TableCell>
                                        </TableRow>
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
