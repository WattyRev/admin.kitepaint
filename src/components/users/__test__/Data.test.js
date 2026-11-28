import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import api from '../../../api/KitePaintApi';
import User from '../../../models/User';
import UsersData from '../Data';

jest.mock('../../../api/KitePaintApi');

describe('UsersData', () => {
    beforeEach(() => {
        api.getUsers.mockResolvedValue({ users: [], total: 0 });
    });
    it('renders', () => {
        expect.assertions(1);
        const { findByTestId } = render(<UsersData>{() => <div data-testid="test" />}</UsersData>);
        const element = findByTestId('test');
        expect(element).toBeDefined();
    });
    it('provides users fetched from the API', async () => {
        expect.assertions(1);
        api.getUsers.mockResolvedValue({
            users: [
                new User({
                    loginid: '1',
                    username: 'boogers',
                }),
            ],
            total: 1,
        });
        const { findByText } = render(
            <UsersData>
                {({ users }) =>
                    users.map(user => <div key={user.get('loginid')}>{user.get('username')}</div>)
                }
            </UsersData>
        );
        expect(await findByText(/boogers/)).toBeInTheDocument();
    });
    it('sets isLoading to true while waiting for data', async () => {
        expect.assertions(3);
        api.getUsers.mockResolvedValue({
            users: [
                new User({
                    loginid: '1',
                    username: 'boogers',
                }),
            ],
            total: 1,
        });
        const { getByTestId, findByTestId } = render(
            <UsersData>
                {({ isLoading }) => (
                    <React.Fragment>
                        {isLoading && <div data-testid="isLoading" />}
                        {!isLoading && <div data-testid="isNotLoading" />}
                    </React.Fragment>
                )}
            </UsersData>
        );
        expect(getByTestId('isNotLoading')).toBeDefined();
        expect(() => getByTestId('isLoading')).toThrow();
        expect(await findByTestId('isLoading')).toBeDefined();
    });
    it('sets isLoading to false when data is retrieved', async () => {
        expect.assertions(2);
        api.getUsers.mockResolvedValue({
            users: [
                new User({
                    loginid: '1',
                    username: 'boogers',
                }),
            ],
            total: 1,
        });
        const { findByTestId } = render(
            <UsersData>
                {({ isLoading }) => (
                    <React.Fragment>
                        {isLoading && <div data-testid="isLoading" />}
                        {!isLoading && <div data-testid="isNotLoading" />}
                    </React.Fragment>
                )}
            </UsersData>
        );
        expect(await findByTestId('isLoading')).toBeDefined();
        expect(await findByTestId('isNotLoading')).toBeDefined();
    });
    it('updates the searchTerm when setSearchTerm is called', async () => {
        expect.assertions(1);
        const { getByText, findByText } = render(
            <UsersData>
                {({ searchTerm, setSearchTerm }) => (
                    <React.Fragment>
                        <div>{searchTerm}</div>
                        <button type="button" onClick={() => setSearchTerm('boogers')}>
                            Set Search Term
                        </button>
                    </React.Fragment>
                )}
            </UsersData>
        );
        fireEvent.click(getByText('Set Search Term'));
        expect(await findByText('boogers')).toBeDefined();
    });
    it('updates the searchTerm and the searchCriteria when search is called', async () => {
        expect.assertions(1);
        const { getByText, findByText } = render(
            <UsersData>
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
            </UsersData>
        );
        fireEvent.click(getByText('Search'));
        expect(await findByText('name:boogers')).toBeDefined();
    });
    it('triggers a search with the updated searchTerm and searchCriteria when search is called', () => {
        expect.assertions(1);
        const { getByText } = render(
            <UsersData>
                {({ search }) => (
                    <button type="button" onClick={() => search('name', 'boogers')}>
                        Search
                    </button>
                )}
            </UsersData>
        );
        fireEvent.click(getByText('Search'));
        expect(api.getUsers).toHaveBeenCalledWith({
            searchCriteria: 'name',
            searchTerm: 'boogers',
            sortBy: 'last_login',
            sortDirection: 'DESC',
            page: 1,
            pageSize: 100,
        });
    });

    describe('sorting and pagination', () => {
        const renderData = () => {
            let latest;
            render(
                <UsersData>
                    {data => {
                        latest = data;
                        return null;
                    }}
                </UsersData>
            );
            return () => latest;
        };

        it('fetches the first page sorted by last login, newest first, by default', async () => {
            renderData();
            await waitFor(() =>
                expect(api.getUsers).toHaveBeenCalledWith(
                    expect.objectContaining({
                        sortBy: 'last_login',
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
                await getData().sort('username');
            });
            expect(api.getUsers).toHaveBeenLastCalledWith(
                expect.objectContaining({ sortBy: 'username', sortDirection: 'ASC', page: 1 })
            );
            expect(getData().sortBy).toBe('username');
        });

        it('reverses the direction when the active column is sorted again', async () => {
            const getData = renderData();
            await waitFor(() => expect(getData().isLoading).toBe(false));
            await act(async () => {
                await getData().sort('last_login');
            });
            expect(api.getUsers).toHaveBeenLastCalledWith(
                expect.objectContaining({ sortBy: 'last_login', sortDirection: 'ASC' })
            );
            await act(async () => {
                await getData().sort('last_login');
            });
            expect(api.getUsers).toHaveBeenLastCalledWith(
                expect.objectContaining({ sortBy: 'last_login', sortDirection: 'DESC' })
            );
        });

        it('requests the created column as create_time', async () => {
            const getData = renderData();
            await waitFor(() => expect(getData().isLoading).toBe(false));
            await act(async () => {
                await getData().sort('created');
            });
            expect(api.getUsers).toHaveBeenLastCalledWith(
                expect.objectContaining({ sortBy: 'create_time', sortDirection: 'DESC' })
            );
            expect(getData().sortBy).toBe('created');
        });

        it('calculates the total pages from the total', async () => {
            api.getUsers.mockResolvedValue({ users: [], total: 250 });
            const getData = renderData();
            await waitFor(() => expect(getData().totalPages).toBe(3));
        });

        it('fetches the requested page', async () => {
            api.getUsers.mockResolvedValue({ users: [], total: 250 });
            const getData = renderData();
            await waitFor(() => expect(getData().totalPages).toBe(3));
            await act(async () => {
                await getData().setPage(2);
            });
            expect(api.getUsers).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2 }));
            expect(getData().page).toBe(2);
        });

        it('keeps the page and sort when refreshing', async () => {
            api.getUsers.mockResolvedValue({ users: [], total: 250 });
            const getData = renderData();
            await waitFor(() => expect(getData().totalPages).toBe(3));
            await act(async () => {
                await getData().setPage(2);
            });
            await act(async () => {
                await getData().refresh();
            });
            expect(api.getUsers).toHaveBeenLastCalledWith(
                expect.objectContaining({ page: 2, sortBy: 'last_login', sortDirection: 'DESC' })
            );
        });

        it('returns to the first page when sorting or searching', async () => {
            api.getUsers.mockResolvedValue({ users: [], total: 250 });
            const getData = renderData();
            await waitFor(() => expect(getData().totalPages).toBe(3));
            await act(async () => {
                await getData().setPage(3);
            });
            await act(async () => {
                await getData().sort('username');
            });
            expect(api.getUsers).toHaveBeenLastCalledWith(
                expect.objectContaining({ page: 1, sortBy: 'username' })
            );
            await act(async () => {
                await getData().setPage(2);
            });
            await act(async () => {
                await getData().search('username', 'boogers');
            });
            expect(api.getUsers).toHaveBeenLastCalledWith(
                expect.objectContaining({ page: 1, searchTerm: 'boogers' })
            );
        });
    });
});
