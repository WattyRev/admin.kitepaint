import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import api from '../../api/KitePaintApi';

export const PAGE_SIZE = 100;

// The direction a column is sorted in the first time it is selected.
const DEFAULT_DIRECTIONS = {
    name: 'ASC',
    updated: 'DESC',
    created: 'DESC',
};

/**
 * A headless component for managing Design data.
 */
const DesignsData = ({ children }) => {
    const [designs, setDesigns] = useState([]);
    const [total, setTotal] = useState(0);
    const [searchCriteria, setSearchCriteria] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('created');
    const [sortDirection, setSortDirection] = useState('DESC');
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const latestRequest = useRef(0);

    /**
     * Fetches designs. Any option that is not provided falls back to the current state.
     */
    async function fetchDesigns(options = {}) {
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
            .getDesigns({ ...params, pageSize: PAGE_SIZE })
            .catch(() => undefined);
        // Ignore the response if a newer request has been made since.
        if (requestId !== latestRequest.current) {
            return;
        }
        if (result) {
            setDesigns(result.designs || []);
            setTotal(result.total || 0);
        } else {
            setDesigns([]);
            setTotal(0);
        }
        setIsLoading(false);
    }

    function search(criteria, term) {
        setSearchCriteria(criteria);
        setSearchTerm(term);
        setPage(1);
        return fetchDesigns({
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
        return fetchDesigns({
            sortBy: column,
            sortDirection: direction,
            page: 1,
        });
    }

    function goToPage(newPage) {
        setPage(newPage);
        return fetchDesigns({ page: newPage });
    }

    useEffect(() => {
        fetchDesigns();
    }, []);

    return children({
        designs: designs || [],
        isLoading,
        searchTerm,
        setSearchTerm,
        searchCriteria,
        search,
        refresh: fetchDesigns,
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

DesignsData.propTypes = {
    children: PropTypes.func.isRequired,
};

export default DesignsData;
