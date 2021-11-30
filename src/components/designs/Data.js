import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import api from '../../api/KitePaintApi';

/**
 * A headless component for managing Design data.
 */
const DesignsData = ({ children }) => {
    const [designs, setDesigns] = useState([]);
    const [searchCriteria, setSearchCriteria] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function fetchDesigns(criteria, term) {
        setIsLoading(true);
        const resolvedDesigns = await api
            .getDesigns({
                searchCriteria: criteria || searchCriteria,
                searchTerm: term || searchTerm,
            })
            .catch(() => {});
        setDesigns(resolvedDesigns);
        setIsLoading(false);
    }

    function search(criteria, term) {
        setSearchCriteria(criteria);
        setSearchTerm(term);
        return fetchDesigns(criteria, term);
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
    });
};

DesignsData.propTypes = {
    children: PropTypes.func.isRequired,
};

export default DesignsData;
