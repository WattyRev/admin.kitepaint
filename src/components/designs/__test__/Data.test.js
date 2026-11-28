import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import api from '../../../api/KitePaintApi';
import Design from '../../../models/Design';
import DesignsData from '../Data';

jest.mock('../../../api/KitePaintApi');

describe('DesignsData', () => {
    beforeEach(() => {
        api.getDesigns.mockResolvedValue({ designs: [], total: 0 });
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
        api.getDesigns.mockResolvedValue({
            designs: [
                new Design({
                    id: '1',
                    name: 'boogers',
                }),
            ],
            total: 1,
        });
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
        api.getDesigns.mockResolvedValue({
            designs: [
                new Design({
                    id: '1',
                    name: 'boogers',
                }),
            ],
            total: 1,
        });
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
        api.getDesigns.mockResolvedValue({
            designs: [
                new Design({
                    id: '1',
                    name: 'boogers',
                }),
            ],
            total: 1,
        });
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
            sortBy: 'created',
            sortDirection: 'DESC',
            page: 1,
            pageSize: 100,
        });
    });

    describe('sorting and pagination', () => {
        const renderData = () => {
            let latest;
            render(
                <DesignsData>
                    {data => {
                        latest = data;
                        return null;
                    }}
                </DesignsData>
            );
            return () => latest;
        };

        it('fetches the first page sorted by created, newest first, by default', async () => {
            renderData();
            await waitFor(() =>
                expect(api.getDesigns).toHaveBeenCalledWith(
                    expect.objectContaining({
                        sortBy: 'created',
                        sortDirection: 'DESC',
                        page: 1,
                    })
                )
            );
        });

        it('sorts a new column using its default direction', async () => {
            const getData = renderData();
            await waitFor(() => expect(getData().isLoading).toBe(false));
            await act(async () => {
                await getData().sort('name');
            });
            expect(api.getDesigns).toHaveBeenLastCalledWith(
                expect.objectContaining({ sortBy: 'name', sortDirection: 'ASC', page: 1 })
            );
            expect(getData().sortBy).toBe('name');
        });

        it('reverses the direction when the active column is sorted again', async () => {
            const getData = renderData();
            await waitFor(() => expect(getData().isLoading).toBe(false));
            await act(async () => {
                await getData().sort('created');
            });
            expect(api.getDesigns).toHaveBeenLastCalledWith(
                expect.objectContaining({ sortBy: 'created', sortDirection: 'ASC' })
            );
            await act(async () => {
                await getData().sort('created');
            });
            expect(api.getDesigns).toHaveBeenLastCalledWith(
                expect.objectContaining({ sortBy: 'created', sortDirection: 'DESC' })
            );
        });

        it('calculates the total pages from the total', async () => {
            api.getDesigns.mockResolvedValue({ designs: [], total: 250 });
            const getData = renderData();
            await waitFor(() => expect(getData().totalPages).toBe(3));
        });

        it('fetches the requested page', async () => {
            api.getDesigns.mockResolvedValue({ designs: [], total: 250 });
            const getData = renderData();
            await waitFor(() => expect(getData().totalPages).toBe(3));
            await act(async () => {
                await getData().setPage(2);
            });
            expect(api.getDesigns).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2 }));
            expect(getData().page).toBe(2);
        });

        it('keeps the page and sort when refreshing', async () => {
            api.getDesigns.mockResolvedValue({ designs: [], total: 250 });
            const getData = renderData();
            await waitFor(() => expect(getData().totalPages).toBe(3));
            await act(async () => {
                await getData().setPage(2);
            });
            await act(async () => {
                await getData().refresh();
            });
            expect(api.getDesigns).toHaveBeenLastCalledWith(
                expect.objectContaining({ page: 2, sortBy: 'created', sortDirection: 'DESC' })
            );
        });

        it('returns to the first page when sorting or searching', async () => {
            api.getDesigns.mockResolvedValue({ designs: [], total: 250 });
            const getData = renderData();
            await waitFor(() => expect(getData().totalPages).toBe(3));
            await act(async () => {
                await getData().setPage(3);
            });
            await act(async () => {
                await getData().sort('name');
            });
            expect(api.getDesigns).toHaveBeenLastCalledWith(
                expect.objectContaining({ page: 1, sortBy: 'name' })
            );
            await act(async () => {
                await getData().setPage(2);
            });
            await act(async () => {
                await getData().search('name', 'boogers');
            });
            expect(api.getDesigns).toHaveBeenLastCalledWith(
                expect.objectContaining({ page: 1, searchTerm: 'boogers' })
            );
        });
    });
});
