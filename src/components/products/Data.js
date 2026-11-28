import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import api from '../../api/KitePaintApi';

// The direction a column is sorted in the first time it is selected.
const DEFAULT_DIRECTIONS = {
    name: 'ASC',
    manufacturer: 'ASC',
    created: 'DESC',
};

/**
 * A headless component for managing Product data.
 */
const ProductsData = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [searchCriteria, setSearchCriteria] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('created');
    const [sortDirection, setSortDirection] = useState('DESC');
    const [isLoading, setIsLoading] = useState(false);
    const latestRequest = useRef(0);

    /**
     * Fetches products. Any option that is not provided falls back to the current state.
     */
    async function fetchProducts(options = {}) {
        const params = {
            searchCriteria,
            searchTerm,
            sortBy,
            sortDirection,
            ...options,
        };
        latestRequest.current += 1;
        const requestId = latestRequest.current;
        setIsLoading(true);
        const resolvedProducts = await api.getProducts(params).catch(() => {});
        // Ignore the response if a newer request has been made since.
        if (requestId !== latestRequest.current) {
            return;
        }
        setProducts(resolvedProducts);
        setIsLoading(false);
    }

    function search(criteria, term) {
        setSearchCriteria(criteria);
        setSearchTerm(term);
        return fetchProducts({ searchCriteria: criteria, searchTerm: term });
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
        return fetchProducts({ sortBy: column, sortDirection: direction });
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    return children({
        products: products || [],
        isLoading,
        searchTerm,
        setSearchTerm,
        searchCriteria,
        search,
        refresh: fetchProducts,
        sortBy,
        sortDirection,
        sort,
    });
};

ProductsData.propTypes = {
    children: PropTypes.func.isRequired,
};

export default ProductsData;
