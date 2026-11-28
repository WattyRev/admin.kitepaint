import React from 'react';
import { fireEvent } from '@testing-library/react';
import Design from '../../models/Design';
import DesignsData from '../designs/Data';
import Designs from '../Designs';

jest.mock('../designs/Data');

describe('Designs', () => {
    let designsDataResponse;
    beforeEach(() => {
        designsDataResponse = {
            searchCriteria: '',
            searchTerm: '',
            designs: [],
            isLoading: false,
            setSearchTerm: jest.fn(),
            search: jest.fn(),
            sortBy: 'created',
            sortDirection: 'DESC',
            sort: jest.fn(),
            page: 1,
            pageSize: 100,
            total: 0,
            totalPages: 1,
            setPage: jest.fn(),
        };
        DesignsData.mockImplementation(({ children }) => children(designsDataResponse));
    });
    it('renders the heading', () => {
        const { getByText } = renderWithTheme(<Designs />);
        const headingElement = getByText(/Designs/);
        expect(headingElement).toBeInTheDocument();
    });

    describe('Search', () => {
        it('triggers a search when the criteria changes', () => {
            expect.assertions(1);
            const { getByTestId } = renderWithTheme(<Designs />);
            const criteriaElement = getByTestId('search-criteria');
            fireEvent.change(criteriaElement, {
                target: {
                    value: 'name',
                },
            });
            expect(designsDataResponse.search).toHaveBeenCalledWith('name', '');
        });
        it('triggers search when the term blurs', () => {
            expect.assertions(1);
            const { getByTestId } = renderWithTheme(<Designs />);
            const termElement = getByTestId('search-term');
            fireEvent.blur(termElement, {
                target: {
                    value: 'boogers',
                },
            });
            expect(designsDataResponse.search).toHaveBeenCalledWith('', 'boogers');
        });
        it('does not trigger search when the term changes', () => {
            expect.assertions(1);
            const { getByTestId } = renderWithTheme(<Designs />);
            const termElement = getByTestId('search-term');
            fireEvent.change(termElement, {
                target: {
                    value: 'boogers',
                },
            });
            expect(designsDataResponse.search).not.toHaveBeenCalled();
        });
        it('sets the search term when it changes', () => {
            expect.assertions(1);
            const { getByTestId } = renderWithTheme(<Designs />);
            const termElement = getByTestId('search-term');
            fireEvent.change(termElement, {
                target: {
                    value: 'boogers',
                },
            });
            expect(designsDataResponse.setSearchTerm).toHaveBeenCalledWith('boogers');
        });
    });
    describe('Search criteria', () => {
        it('can search by user and product names as well as ids', () => {
            expect.assertions(1);
            const { getByTestId } = renderWithTheme(<Designs />);
            const values = Array.from(
                getByTestId('search-criteria').querySelectorAll('option')
            ).map(option => option.value);
            expect(values).toStrictEqual(
                expect.arrayContaining(['user', 'username', 'product', 'product_name'])
            );
        });
    });
    describe('Sorting', () => {
        it('sorts by the clicked column', () => {
            expect.assertions(3);
            const { getByTestId } = renderWithTheme(<Designs />);
            fireEvent.click(getByTestId('sort-name'));
            fireEvent.click(getByTestId('sort-updated'));
            fireEvent.click(getByTestId('sort-created'));
            expect(designsDataResponse.sort).toHaveBeenCalledWith('name');
            expect(designsDataResponse.sort).toHaveBeenCalledWith('updated');
            expect(designsDataResponse.sort).toHaveBeenCalledWith('created');
        });
        it('indicates the active sort column and direction', () => {
            expect.assertions(3);
            const { getByTestId } = renderWithTheme(<Designs />);
            expect(getByTestId('sort-created').closest('th')).toHaveAttribute(
                'aria-sort',
                'descending'
            );
            expect(getByTestId('sort-created')).toHaveTextContent('\u25BC');
            expect(getByTestId('sort-name').closest('th')).toHaveAttribute('aria-sort', 'none');
        });
        it('indicates an ascending sort', () => {
            expect.assertions(2);
            designsDataResponse.sortBy = 'name';
            designsDataResponse.sortDirection = 'ASC';
            const { getByTestId } = renderWithTheme(<Designs />);
            expect(getByTestId('sort-name').closest('th')).toHaveAttribute(
                'aria-sort',
                'ascending'
            );
            expect(getByTestId('sort-name')).toHaveTextContent('\u25B2');
        });
    });
    describe('Pagination', () => {
        it('does not render pagination when there is only one page', () => {
            expect.assertions(1);
            const { queryByTestId } = renderWithTheme(<Designs />);
            expect(queryByTestId('pagination')).toBeNull();
        });
        it('changes the page when a pagination button is clicked', () => {
            expect.assertions(2);
            designsDataResponse.total = 250;
            designsDataResponse.totalPages = 3;
            const { getByLabelText } = renderWithTheme(<Designs />);
            fireEvent.click(getByLabelText('Next page'));
            expect(designsDataResponse.setPage).toHaveBeenCalledWith(2);
            fireEvent.click(getByLabelText('Page 3'));
            expect(designsDataResponse.setPage).toHaveBeenCalledWith(3);
        });
    });
    describe('Loading', () => {
        it('shows the PageLoader while data is loading', () => {
            expect.assertions(1);
            designsDataResponse.isLoading = true;
            const { getByTestId } = renderWithTheme(<Designs />);
            expect(getByTestId('loading')).toBeDefined();
        });
        it('does not show the page loader while data is not loading', () => {
            expect.assertions(1);
            designsDataResponse.isLoading = false;
            const { getByTestId } = renderWithTheme(<Designs />);
            expect(() => getByTestId('loading')).toThrow();
        });
        it('does not show the table while data is loading', () => {
            expect.assertions(1);
            designsDataResponse.isLoading = true;
            const { getByTestId } = renderWithTheme(<Designs />);
            expect(() => getByTestId('data-table')).toThrow();
        });
        it('does show the table while data is not loading', () => {
            expect.assertions(1);
            designsDataResponse.isLoading = false;
            const { getByTestId } = renderWithTheme(<Designs />);
            expect(getByTestId('data-table')).toBeDefined();
        });
    });
    describe('Table', () => {
        it('renders a row for each design', () => {
            expect.assertions(2);
            designsDataResponse.designs = [
                new Design({
                    id: '1',
                    name: 'boogers',
                }),
                new Design({
                    id: '2',
                    name: 'thing',
                }),
            ];
            const { getByText, queryAllByTestId } = renderWithTheme(<Designs />);
            expect(getByText('boogers')).toBeDefined();
            expect(queryAllByTestId('design-row')).toHaveLength(2);
        });
        it('displays the user and product as name (id)', () => {
            expect.assertions(2);
            designsDataResponse.designs = [
                new Design({
                    id: '1',
                    name: 'boogers',
                    user: '12',
                    username: 'Void',
                    product: '3',
                    productName: 'B-Series PRO',
                }),
            ];
            const { getByText } = renderWithTheme(<Designs />);
            expect(getByText('Void (12)')).toBeInTheDocument();
            expect(getByText('B-Series PRO (3)')).toBeInTheDocument();
        });
        it('displays only the ids when there are no names', () => {
            expect.assertions(2);
            designsDataResponse.designs = [
                new Design({
                    id: '1',
                    name: 'boogers',
                    user: '12',
                    product: '3',
                }),
            ];
            const { getByText } = renderWithTheme(<Designs />);
            expect(getByText('12')).toBeInTheDocument();
            expect(getByText('3')).toBeInTheDocument();
        });
        it('displays active as true', () => {
            expect.assertions(2);
            designsDataResponse.designs = [
                new Design({
                    id: '1',
                    name: 'boogers',
                    active: true,
                }),
            ];
            const { getByText } = renderWithTheme(<Designs />);
            expect(getByText('True')).toBeDefined();
            expect(() => getByText('False')).toThrow();
        });
        it('displays active as false', () => {
            expect.assertions(2);
            designsDataResponse.designs = [
                new Design({
                    id: '1',
                    name: 'boogers',
                    active: false,
                }),
            ];
            const { getByText } = renderWithTheme(<Designs />);
            expect(getByText('False')).toBeDefined();
            expect(() => getByText('True')).toThrow();
        });
    });
});
