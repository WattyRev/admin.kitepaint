import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import api from '../../../api/KitePaintApi';
import Design from '../../../models/Design';
import DesignsData from '../Data';

jest.mock('../../../api/KitePaintApi');

describe('DesignsData', () => {
    beforeEach(() => {
        api.getDesigns.mockResolvedValue([]);
    });
    it('renders', () => {
        expect.assertions(1);
        const { findByTestId } = render(
            <DesignsData>{() => <div data-testid="test" />}</DesignsData>
        );
        const element = findByTestId('test');
        expect(element).toBeDefined();
    });
    it('provides designs fetched from the API', async () => {
        expect.assertions(1);
        api.getDesigns.mockResolvedValue([
            new Design({
                id: '1',
                name: 'boogers',
            }),
        ]);
        const { findByText } = render(
            <DesignsData>
                {({ designs }) =>
                    designs.map(design => <div key={design.get('id')}>{design.get('name')}</div>)
                }
            </DesignsData>
        );
        expect(await findByText(/boogers/)).toBeInTheDocument();
    });
    it('sets isLoading to true while waiting for data', async () => {
        expect.assertions(3);
        api.getDesigns.mockResolvedValue([
            new Design({
                id: '1',
                name: 'boogers',
            }),
        ]);
        const { getByTestId, findByTestId } = render(
            <DesignsData>
                {({ isLoading }) => (
                    <React.Fragment>
                        {isLoading && <div data-testid="isLoading" />}
                        {!isLoading && <div data-testid="isNotLoading" />}
                    </React.Fragment>
                )}
            </DesignsData>
        );
        expect(getByTestId('isNotLoading')).toBeDefined();
        expect(() => getByTestId('isLoading')).toThrow();
        expect(await findByTestId('isLoading')).toBeDefined();
    });
    it('sets isLoading to false when data is retrieved', async () => {
        expect.assertions(2);
        api.getDesigns.mockResolvedValue([
            new Design({
                id: '1',
                name: 'boogers',
            }),
        ]);
        const { findByTestId } = render(
            <DesignsData>
                {({ isLoading }) => (
                    <React.Fragment>
                        {isLoading && <div data-testid="isLoading" />}
                        {!isLoading && <div data-testid="isNotLoading" />}
                    </React.Fragment>
                )}
            </DesignsData>
        );
        expect(await findByTestId('isLoading')).toBeDefined();
        expect(await findByTestId('isNotLoading')).toBeDefined();
    });
    it('updates the searchTerm when setSearchTerm is called', async () => {
        expect.assertions(1);
        const { getByText, findByText } = render(
            <DesignsData>
                {({ searchTerm, setSearchTerm }) => (
                    <React.Fragment>
                        <div>{searchTerm}</div>
                        <button type="button" onClick={() => setSearchTerm('boogers')}>
                            Set Search Term
                        </button>
                    </React.Fragment>
                )}
            </DesignsData>
        );
        fireEvent.click(getByText('Set Search Term'));
        expect(await findByText('boogers')).toBeDefined();
    });
    it('updates the searchTerm and the searchCriteria when search is called', async () => {
        expect.assertions(1);
        const { getByText, findByText } = render(
            <DesignsData>
                {({ searchTerm, searchCriteria, search }) => (
                    <React.Fragment>
                        <div>
                            {searchCriteria}:{searchTerm}
                        </div>
                        <button type="button" onClick={() => search('name', 'boogers')}>
                            Search
                        </button>
                    </React.Fragment>
                )}
            </DesignsData>
        );
        fireEvent.click(getByText('Search'));
        expect(await findByText('name:boogers')).toBeDefined();
    });
    it('triggers a search with the updated searchTerm and searchCriteria when search is called', () => {
        expect.assertions(1);
        const { getByText } = render(
            <DesignsData>
                {({ search }) => (
                    <button type="button" onClick={() => search('name', 'boogers')}>
                        Search
                    </button>
                )}
            </DesignsData>
        );
        fireEvent.click(getByText('Search'));
        expect(api.getDesigns).toHaveBeenCalledWith({
            searchCriteria: 'name',
            searchTerm: 'boogers',
        });
    });
});
