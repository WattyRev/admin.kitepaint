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
    Button,
} from 'react-watty-ui';
import PageWrapper from './ui/PageWrapper';
import SearchWrapper from './ui/SearchWrapper';
import ProductsData from './products/Data';
import ProductsEdit from './products/Edit';
import ProductsCreate from './products/Create';
import { formatNameWithId } from '../models/Design';

const SortButton = styled(TextButton)`
    font-weight: inherit;
    color: inherit;
`;

const Products = () => {
    const [editedProduct, setEditedProduct] = useState(null);
    const [creatingProduct, setCreatingProduct] = useState(false);
    return (
        <PageWrapper>
            <H1>Products</H1>
            <Spacer bottom="md" as="div" />
            <Button type="button" isPrimary onClick={() => setCreatingProduct(true)}>
                Add New Product
            </Button>
            <ProductsData>
                {({
                    products,
                    isLoading,
                    searchTerm,
                    setSearchTerm,
                    searchCriteria,
                    search,
                    refresh,
                    sortBy,
                    sortDirection,
                    sort,
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
                                    <option value="manufacturer">Manufacturer ID</option>
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
                                            {renderSortableHeading('manufacturer', 'Manufacturer')}
                                            {renderSortableHeading('created', 'Created')}
                                            <TableHeading>URL</TableHeading>
                                            <TableHeading>Status</TableHeading>
                                            <TableHeading />
                                        </TableRow>
                                    </thead>
                                    <tbody>
                                        {products.map(product => (
                                            <TableRow
                                                data-testid="product-row"
                                                key={product.get('id')}
                                            >
                                                <TableCell>{product.get('id')}</TableCell>
                                                <TableCell>{product.get('name')}</TableCell>
                                                <TableCell>
                                                    {formatNameWithId(
                                                        product.get('manufacturerName'),
                                                        product.get('manufacturer')
                                                    )}
                                                </TableCell>
                                                <TableCell>{product.get('created')}</TableCell>
                                                <TableCell>{product.get('url')}</TableCell>
                                                <TableCell>{product.get('status')}</TableCell>
                                                <TableCell>
                                                    <TextButton
                                                        onClick={() => setEditedProduct(product)}
                                                    >
                                                        Edit
                                                    </TextButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                            <ProductsEdit
                                product={editedProduct}
                                onClose={() => setEditedProduct(null)}
                                onSubmit={() => refresh()}
                            />
                            <ProductsCreate
                                isOpen={creatingProduct}
                                onClose={() => setCreatingProduct(false)}
                                onSubmit={() => refresh()}
                            />
                        </React.Fragment>
                    );
                }}
            </ProductsData>
        </PageWrapper>
    );
};

export default Products;
