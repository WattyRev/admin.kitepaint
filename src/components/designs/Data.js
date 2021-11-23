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

    async function fetchDesigns() {
        setIsLoading(true);
        const resolvedDesigns = await api
            .getDesigns({
                searchCriteria,
                searchTerm,
            })
            .catch(() => {});
        setDesigns(resolvedDesigns);
        setIsLoading(false);
    }

    function search(criteria, term) {
        setSearchCriteria(criteria);
        setSearchTerm(term);
        return fetchDesigns();
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
    });
};

DesignsData.propTypes = {
    children: PropTypes.func.isRequired,
};

export default DesignsData;
