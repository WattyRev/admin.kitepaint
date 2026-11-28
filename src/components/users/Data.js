import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import api from '../../api/KitePaintApi';

export const PAGE_SIZE = 100;

// The direction a column is sorted in the first time it is selected.
const DEFAULT_DIRECTIONS = {
    username: 'ASC',
    email: 'ASC',
    created: 'DESC',
    last_login: 'DESC',
};

// Maps the column names used by the UI to the column names used by the API.
const API_COLUMNS = {
    created: 'create_time',
};

/**
 * A headless component for managing User data.
 */
const UsersData = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [total, setTotal] = useState(0);
    const [searchCriteria, setSearchCriteria] = useState('username');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('last_login');
    const [sortDirection, setSortDirection] = useState('DESC');
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const latestRequest = useRef(0);

    /**
     * Fetches users. Any option that is not provided falls back to the current state.
     */
    async function fetchUsers(options = {}) {
        const params = {
            searchCriteria,
            searchTerm,
            sortBy,
            sortDirection,
            page,
            ...options,
        };
        latestRequest.current += 1;
        const requestId = latestRequest.current;
        setIsLoading(true);
        const result = await api
            .getUsers({
                ...params,
                sortBy: API_COLUMNS[params.sortBy] || params.sortBy,
                pageSize: PAGE_SIZE,
            })
            .catch(() => undefined);
        // Ignore the response if a newer request has been made since.
        if (requestId !== latestRequest.current) {
            return;
        }
        if (result) {
            setUsers(result.users || []);
            setTotal(result.total || 0);
        } else {
            setUsers([]);
            setTotal(0);
        }
        setIsLoading(false);
    }

    function search(criteria, term) {
        setSearchCriteria(criteria);
        setSearchTerm(term);
        setPage(1);
        return fetchUsers({
            searchCriteria: criteria,
            searchTerm: term,
            page: 1,
        });
    }

    function sort(column) {
        let direction;
        if (column === sortBy) {
            direction = sortDirection === 'ASC' ? 'DESC' : 'ASC';
        } else {
            direction = DEFAULT_DIRECTIONS[column] || 'ASC';
        }
        setSortBy(column);
        setSortDirection(direction);
        setPage(1);
        return fetchUsers({
            sortBy: column,
            sortDirection: direction,
            page: 1,
        });
    }

    function goToPage(newPage) {
        setPage(newPage);
        return fetchUsers({ page: newPage });
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    return children({
        users: users || [],
        isLoading,
        searchTerm,
        setSearchTerm,
        searchCriteria,
        search,
        refresh: fetchUsers,
        sortBy,
        sortDirection,
        sort,
        page,
        pageSize: PAGE_SIZE,
        total,
        totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
        setPage: goToPage,
    });
};

UsersData.propTypes = {
    children: PropTypes.func.isRequired,
};

export default UsersData;
