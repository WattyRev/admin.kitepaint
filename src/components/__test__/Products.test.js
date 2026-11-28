import React from 'react';
import { act, fireEvent, within } from '@testing-library/react';
import mockProducts from '../../../mock-api/data/products';
import mockManufacturers from '../../../mock-api/data/manufacturers';
import { transformProduct } from '../../models/Product';
import { transformManufacturer } from '../../models/Manufacturer';
import api from '../../api/KitePaintApi';
import generateId from '../../util/generateId';
import Products from '../Products';

jest.mock('../../api/KitePaintApi');
jest.mock('../../util/generateId');

describe('Products', () => {
    beforeEach(() => {
        api.getProducts.mockResolvedValue(mockProducts.map(transformProduct));
        api.getManufacturers.mockResolvedValue(mockManufacturers.map(transformManufacturer));
        api.updateProduct.mockResolvedValue();
        api.createProduct.mockResolvedValue();
        generateId.mockReturnValue('generated-id');
    });

    /** Picks a manufacturer in the form's lookup by searching for the given term. */
    async function pickManufacturer({ getByLabelText, findAllByTestId }, term) {
        fireEvent.change(getByLabelText('Manufacturer'), {
            target: { value: term },
        });
        const [result] = await findAllByTestId('lookup-result');
        fireEvent.mouseDown(result);
    }

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
    it('searches by name by default, as the user types', () => {
        expect.assertions(1);
        jest.useFakeTimers();
        const { getByPlaceholderText } = renderWithTheme(<Products />);
        fireEvent.change(getByPlaceholderText('Search'), {
            target: {
                value: 'test',
            },
        });
        act(() => {
            jest.advanceTimersByTime(300);
        });
        expect(api.getProducts).toHaveBeenCalledWith({
            searchCriteria: 'name',
            searchTerm: 'test',
            sortBy: 'created',
            sortDirection: 'DESC',
        });
        jest.useRealTimers();
    });
    it('can search products by another field', () => {
        expect.assertions(1);
        jest.useFakeTimers();
        const { getByTestId, getByPlaceholderText } = renderWithTheme(<Products />);
        fireEvent.change(getByTestId('search-criteria'), {
            target: {
                value: 'id',
            },
        });
        fireEvent.change(getByPlaceholderText('Search'), {
            target: {
                value: '3',
            },
        });
        act(() => {
            jest.advanceTimersByTime(300);
        });
        expect(api.getProducts).toHaveBeenCalledWith({
            searchCriteria: 'id',
            searchTerm: '3',
            sortBy: 'created',
            sortDirection: 'DESC',
        });
        jest.useRealTimers();
    });
    it('sorts newest to oldest by default', async () => {
        expect.assertions(3);
        const { findAllByTestId, getByTestId } = renderWithTheme(<Products />);
        await findAllByTestId('product-row');
        expect(api.getProducts).toHaveBeenCalledWith(
            expect.objectContaining({
                sortBy: 'created',
                sortDirection: 'DESC',
            })
        );
        expect(getByTestId('sort-created').closest('th')).toHaveAttribute(
            'aria-sort',
            'descending'
        );
        expect(getByTestId('sort-name').closest('th')).toHaveAttribute('aria-sort', 'none');
    });
    it('sorts by the clicked column, toggling the direction', async () => {
        expect.assertions(4);
        const { findAllByTestId, getByTestId } = renderWithTheme(<Products />);
        await findAllByTestId('product-row');
        fireEvent.click(getByTestId('sort-name'));
        expect(api.getProducts).toHaveBeenLastCalledWith(
            expect.objectContaining({ sortBy: 'name', sortDirection: 'ASC' })
        );
        await findAllByTestId('product-row');
        fireEvent.click(getByTestId('sort-name'));
        expect(api.getProducts).toHaveBeenLastCalledWith(
            expect.objectContaining({ sortBy: 'name', sortDirection: 'DESC' })
        );
        await findAllByTestId('product-row');
        fireEvent.click(getByTestId('sort-manufacturer'));
        expect(api.getProducts).toHaveBeenLastCalledWith(
            expect.objectContaining({
                sortBy: 'manufacturer',
                sortDirection: 'ASC',
            })
        );
        await findAllByTestId('product-row');
        fireEvent.click(getByTestId('sort-created'));
        expect(api.getProducts).toHaveBeenLastCalledWith(
            expect.objectContaining({
                sortBy: 'created',
                sortDirection: 'DESC',
            })
        );
    });
    it('shows the manufacturer name with its id', async () => {
        expect.assertions(1);
        api.getProducts.mockResolvedValue([
            transformProduct({
                ...mockProducts[0],
                manufacturer_name: 'Revolution',
            }),
        ]);
        const { findByTestId } = renderWithTheme(<Products />);
        expect(await findByTestId('product-row')).toHaveTextContent('Revolution (1)');
    });
    it('can edit a product', async () => {
        expect.assertions(3);
        const utils = renderWithTheme(<Products />);
        const {
            findAllByText,
            findByTestId,
            getByLabelText,
            getAllByLabelText,
            getByText,
            getByPlaceholderText,
        } = utils;
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
            variations: [
                {
                    id: '2',
                    name: 'Booger',
                    svg: '<div>Booger</div>',
                    sortIndex: 1,
                },
            ],
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
        await pickManufacturer(utils, newValues.manufacturer);
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

    it('looks up a manufacturer by name', async () => {
        expect.assertions(2);
        const utils = renderWithTheme(<Products />);
        const [addButton] = await utils.findAllByText('Add New Product');
        fireEvent.click(addButton);
        fireEvent.change(await utils.findByLabelText('Manufacturer'), {
            target: { value: 'canvas' },
        });
        const results = await utils.findAllByTestId('lookup-result');
        expect(results).toHaveLength(1);
        fireEvent.mouseDown(results[0]);
        expect(utils.getByLabelText('Manufacturer')).toHaveValue('Canvas Kite Designs (3)');
    });

    it('can create a product', async () => {
        expect.assertions(3);
        const utils = renderWithTheme(<Products />);
        const { findAllByText, findByTestId, getByLabelText, getByText, getByPlaceholderText } =
            utils;
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
                {
                    id: 'generated-id',
                    isNew: true,
                    name: 'Booger',
                    svg: '<div>Booger</div>',
                    sortIndex: 0,
                },
            ],
            notes: ['boogers'],
        };

        fireEvent.change(getByLabelText('Name'), {
            target: {
                value: newValues.name,
            },
        });
        await pickManufacturer(utils, newValues.manufacturer);
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

    describe('variations', () => {
        it('only sends ids for variations that have already been saved', () => {
            expect.assertions(1);
            const product = transformProduct({
                ...mockProducts[0],
                variations: [
                    { id: '12', name: 'Saved', svg: '<a/>', sortIndex: 0 },
                    {
                        id: 'generated-id',
                        isNew: true,
                        name: 'Unsaved',
                        svg: '<b/>',
                        sortIndex: 1,
                    },
                ],
            });
            expect(JSON.parse(product.buildPayload().variations)).toStrictEqual([
                { id: '12', name: 'Saved', svg: '<a/>', sortIndex: 0 },
                { name: 'Unsaved', svg: '<b/>', sortIndex: 1 },
            ]);
        });
    });

    describe('colors', () => {
        /** Opens the new product form and fills in the colors with the given list. */
        async function openCreateFormWithColors(utils, colors) {
            const [addButton] = await utils.findAllByText('Add New Product');
            fireEvent.click(addButton);
            await utils.findByTestId('product-form');
            colors.forEach(({ name, color }, index) => {
                fireEvent.click(utils.getByText('Add Color'));
                fireEvent.change(utils.getAllByPlaceholderText('Color Name')[index], {
                    target: { value: name },
                });
                fireEvent.change(utils.getAllByPlaceholderText('Color Hexidecimal')[index], {
                    target: { value: color },
                });
            });
        }

        const getColorNames = utils =>
            utils.getAllByPlaceholderText('Color Name').map(input => input.value);

        it('can move colors up and down', async () => {
            expect.assertions(4);
            const utils = renderWithTheme(<Products />);
            await openCreateFormWithColors(utils, [
                { name: 'Red', color: '#ff0000' },
                { name: 'Green', color: '#00ff00' },
                { name: 'Blue', color: '#0000ff' },
            ]);
            const form = within(utils.getByTestId('product-form'));
            const colorRows = () =>
                form.getAllByPlaceholderText('Color Name').map(input => input.parentElement);

            // The "up" button is first and the "down" button is second in each row
            const buttonsIn = row => row.querySelectorAll('button:not([aria-label])');
            fireEvent.click(buttonsIn(colorRows()[2])[0]);
            expect(getColorNames(utils)).toStrictEqual(['Red', 'Blue', 'Green']);
            fireEvent.click(buttonsIn(colorRows()[0])[1]);
            expect(getColorNames(utils)).toStrictEqual(['Blue', 'Red', 'Green']);
            // Moving past either end does nothing
            fireEvent.click(buttonsIn(colorRows()[0])[0]);
            fireEvent.click(buttonsIn(colorRows()[2])[1]);
            expect(getColorNames(utils)).toStrictEqual(['Blue', 'Red', 'Green']);

            fireEvent.change(utils.getByLabelText('Name'), { target: { value: 'Boogers' } });
            await pickManufacturer(utils, '3');
            fireEvent.click(utils.getByText('Save'));
            const savedProduct = api.createProduct.mock.calls[0][0];
            expect(savedProduct.get('colors').map(({ name }) => name)).toStrictEqual([
                'Blue',
                'Red',
                'Green',
            ]);
        });

        it('strips extra properties from the colors when saving', async () => {
            expect.assertions(1);
            const utils = renderWithTheme(<Products />);
            const [addButton] = await utils.findAllByText('Add New Product');
            fireEvent.click(addButton);
            await utils.findByTestId('product-form');
            fireEvent.click(utils.getByText('Edit as Text'));
            const textarea = utils.getByPlaceholderText('JSON');
            fireEvent.change(textarea, {
                target: {
                    value: JSON.stringify([
                        { name: 'Red', color: '#ff0000', id: 'abc', extra: { a: 1 } },
                    ]),
                },
            });
            fireEvent.blur(textarea);

            fireEvent.change(utils.getByLabelText('Name'), { target: { value: 'Boogers' } });
            await pickManufacturer(utils, '3');
            fireEvent.click(utils.getByText('Save'));
            const savedProduct = api.createProduct.mock.calls[0][0];
            expect(JSON.parse(savedProduct.buildPayload().colors)).toStrictEqual([
                { name: 'Red', color: '#ff0000' },
            ]);
        });

        it('imports the colors from another product, replacing the existing colors', async () => {
            expect.assertions(3);
            const sourceProduct = transformProduct({
                ...mockProducts[1],
                id: '99',
                name: 'Source Product',
                colors: JSON.stringify([
                    { name: 'Teal', color: '#008080', id: 'extra' },
                    { name: 'Gold', color: '#ffd700' },
                ]),
            });
            api.getProducts.mockResolvedValue([
                ...mockProducts.map(transformProduct),
                sourceProduct,
            ]);
            const utils = renderWithTheme(<Products />);
            await openCreateFormWithColors(utils, [{ name: 'Red', color: '#ff0000' }]);

            fireEvent.change(
                utils.getByPlaceholderText('Import colors from product (search by name)'),
                { target: { value: 'source' } }
            );
            const results = await utils.findAllByTestId('lookup-result');
            expect(results).toHaveLength(1);
            fireEvent.mouseDown(results[0]);

            await utils.findByDisplayValue('Teal');
            expect(getColorNames(utils)).toStrictEqual(['Teal', 'Gold']);

            fireEvent.change(utils.getByLabelText('Name'), { target: { value: 'Boogers' } });
            await pickManufacturer(utils, '3');
            fireEvent.click(utils.getByText('Save'));
            expect(api.createProduct.mock.calls[0][0].get('colors')).toStrictEqual([
                { name: 'Teal', color: '#008080' },
                { name: 'Gold', color: '#ffd700' },
            ]);
        });
    });
});
