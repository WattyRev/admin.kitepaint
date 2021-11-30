import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import api from '../../../api/KitePaintApi';
import User from '../../../models/User';
import UsersData from '../Data';

jest.mock('../../../api/KitePaintApi');

describe('UsersData', () => {
    beforeEach(() => {
        api.getUsers.mockResolvedValue([]);
    });
    it('renders', () => {
        expect.assertions(1);
        const { findByTestId } = render(<UsersData>{() => <div data-testid="test" />}</UsersData>);
        const element = findByTestId('test');
        expect(element).toBeDefined();
    });
    it('provides users fetched from the API', async () => {
        expect.assertions(1);
        api.getUsers.mockResolvedValue([
            new User({
                loginid: '1',
                username: 'boogers',
            }),
        ]);
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
        api.getUsers.mockResolvedValue([
            new User({
                loginid: '1',
                username: 'boogers',
            }),
        ]);
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
        api.getUsers.mockResolvedValue([
            new User({
                loginid: '1',
                username: 'boogers',
            }),
        ]);
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
        });
    });
});
