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
import ProductsData from './products/Data';
import ProductsEdit from './products/Edit';

const Products = () => {
    const [editedProduct, setEditedProduct] = useState(null);
    return (
        <PageWrapper>
            <H1>Products</H1>
            <Spacer bottom="md" as="div" />
            <ProductsData>
                {({
                    products,
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
                                        <TableHeading>Name</TableHeading>
                                        <TableHeading>Manufacturer</TableHeading>
                                        <TableHeading>Created</TableHeading>
                                        <TableHeading>URL</TableHeading>
                                        <TableHeading>Status</TableHeading>
                                        <TableHeading />
                                    </TableRow>
                                </thead>
                                <tbody>
                                    {products.map(product => (
                                        <TableRow data-testid="product-row" key={product.get('id')}>
                                            <TableCell>{product.get('id')}</TableCell>
                                            <TableCell>{product.get('name')}</TableCell>
                                            <TableCell>{product.get('manufacturer')}</TableCell>
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
                    </React.Fragment>
                )}
            </ProductsData>
        </PageWrapper>
    );
};

export default Products;
