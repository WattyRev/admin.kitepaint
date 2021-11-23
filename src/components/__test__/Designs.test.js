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
