import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import api from '../../api/KitePaintApi';

/**
 * A headless component for managing Product data.
 */
const ProductsData = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [searchCriteria, setSearchCriteria] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function fetchProducts(criteria, term) {
        setIsLoading(true);
        const resolvedProducts = await api
            .getProducts({
                searchCriteria: criteria || searchCriteria,
                searchTerm: term || searchTerm,
            })
            .catch(() => {});
        setProducts(resolvedProducts);
        setIsLoading(false);
    }

    function search(criteria, term) {
        setSearchCriteria(criteria);
        setSearchTerm(term);
        return fetchProducts(criteria, term);
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
    });
};

ProductsData.propTypes = {
    children: PropTypes.func.isRequired,
};

export default ProductsData;
