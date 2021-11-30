import React from 'react';
import { fireEvent } from '@testing-library/react';
import mockProducts from '../../../mock-api/data/products';
import { transformProduct } from '../../models/Product';
import api from '../../api/KitePaintApi';
import generateId from '../../util/generateId';
import Products from '../Products';

jest.mock('../../api/KitePaintApi');
jest.mock('../../util/generateId');

describe('Products', () => {
    beforeEach(() => {
        api.getProducts.mockResolvedValue(mockProducts.map(transformProduct));
        api.updateProduct.mockResolvedValue();
        api.createProduct.mockResolvedValue();
        generateId.mockReturnValue('generated-id');
    });

    it('renders', () => {
        expect.assertions(1);
        const { getByText } = renderWithTheme(<Products />);
        const headingElement = getByText(/Products/);
        expect(headingElement).toBeInTheDocument();
    });
    it('displays each product', async () => {
        expect.assertions(1);
        const { findAllByTestId } = renderWithTheme(<Products />);
        expect(await findAllByTestId('product-row')).toHaveLength(mockProducts.length);
    });
    it('can search products', () => {
        expect.assertions(1);
        const { getByTestId, getByPlaceholderText } = renderWithTheme(<Products />);
        fireEvent.change(getByTestId('search-criteria'), {
            target: {
                value: 'name',
            },
        });
        fireEvent.change(getByPlaceholderText('Search'), {
            target: {
                value: 'test',
            },
        });
        fireEvent.blur(getByPlaceholderText('Search'), {
            target: {
                value: 'test',
            },
        });
        expect(api.getProducts).toHaveBeenCalledWith({
            searchCriteria: 'name',
            searchTerm: 'test',
        });
    });
    it('can edit a product', async () => {
        expect.assertions(3);
        const {
            findAllByText,
            findByTestId,
            getByLabelText,
            getAllByLabelText,
            getByText,
            getByPlaceholderText,
        } = renderWithTheme(<Products />);
        const [editButton] = await findAllByText('Edit');
        fireEvent.click(editButton);
        expect(await findByTestId('product-form')).toBeDefined();

        const newValues = {
            id: '0',
            status: 'Unlisted',
            name: 'Boogers',
            manufacturer: '3',
            url: 'http://boogers.com',
            embed: 'boogers.com,booger.com',
            colors: [{ name: 'Black', color: '#000000' }],
            variations: [{ id: '2', name: 'Booger', svg: '<div>Booger</div>', sortIndex: 1 }],
            notes: ['boogers'],
        };

        fireEvent.change(getByLabelText('Status'), {
            target: {
                value: newValues.status,
            },
        });
        fireEvent.change(getByLabelText('Name'), {
            target: {
                value: newValues.name,
            },
        });
        fireEvent.change(getByLabelText('Manufacturer'), {
            target: {
                value: newValues.manufacturer,
            },
        });
        fireEvent.change(getByLabelText('URL'), {
            target: {
                value: newValues.url,
            },
        });
        fireEvent.change(getByLabelText('Embed Domains'), {
            target: {
                value: newValues.embed,
            },
        });
        fireEvent.change(getByPlaceholderText('Color Name'), {
            target: {
                value: newValues.colors[0].name,
            },
        });
        fireEvent.change(getByPlaceholderText('Color Hexidecimal'), {
            target: {
                value: newValues.colors[0].color,
            },
        });
        fireEvent.click(getAllByLabelText('Remove Variation')[0]);
        fireEvent.change(getByPlaceholderText('Name'), {
            target: {
                value: newValues.variations[0].name,
            },
        });
        fireEvent.change(getByPlaceholderText('SVG'), {
            target: {
                value: newValues.variations[0].svg,
            },
        });
        fireEvent.change(getByPlaceholderText('Note'), {
            target: {
                value: newValues.notes[0],
            },
        });

        fireEvent.click(getByText('Save'));
        expect(api.updateProduct).toHaveBeenCalled();
        const savedProduct = api.updateProduct.mock.calls[0][0];
        const submittedValues = savedProduct.getProperties(...Object.keys(newValues));
        expect(submittedValues).toStrictEqual(newValues);
    });

    it('can create a product', async () => {
        expect.assertions(3);
        const { findAllByText, findByTestId, getByLabelText, getByText, getByPlaceholderText } =
            renderWithTheme(<Products />);
        const [editButton] = await findAllByText('Add New Product');
        fireEvent.click(editButton);
        expect(await findByTestId('product-form')).toBeDefined();

        const newValues = {
            id: null,
            name: 'Boogers',
            manufacturer: '3',
            url: 'http://boogers.com',
            embed: 'boogers.com,booger.com',
            colors: [{ name: 'Black', color: '#000000' }],
            variations: [
                { id: 'generated-id', name: 'Booger', svg: '<div>Booger</div>', sortIndex: 0 },
            ],
            notes: ['boogers'],
        };

        fireEvent.change(getByLabelText('Name'), {
            target: {
                value: newValues.name,
            },
        });
        fireEvent.change(getByLabelText('Manufacturer'), {
            target: {
                value: newValues.manufacturer,
            },
        });
        fireEvent.change(getByLabelText('URL'), {
            target: {
                value: newValues.url,
            },
        });
        fireEvent.change(getByLabelText('Embed Domains'), {
            target: {
                value: newValues.embed,
            },
        });
        fireEvent.click(getByText('Add Color'));
        fireEvent.change(getByPlaceholderText('Color Name'), {
            target: {
                value: newValues.colors[0].name,
            },
        });
        fireEvent.change(getByPlaceholderText('Color Hexidecimal'), {
            target: {
                value: newValues.colors[0].color,
            },
        });
        fireEvent.click(getByText('Add Variation'));
        fireEvent.change(getByPlaceholderText('Name'), {
            target: {
                value: newValues.variations[0].name,
            },
        });
        fireEvent.change(getByPlaceholderText('SVG'), {
            target: {
                value: newValues.variations[0].svg,
            },
        });
        fireEvent.click(getByText('Add Note'));
        fireEvent.change(getByPlaceholderText('Note'), {
            target: {
                value: newValues.notes[0],
            },
        });

        fireEvent.click(getByText('Save'));
        expect(api.createProduct).toHaveBeenCalled();
        const savedProduct = api.createProduct.mock.calls[0][0];
        const submittedValues = savedProduct.getProperties(...Object.keys(newValues));
        expect(submittedValues).toStrictEqual(newValues);
    });
});
