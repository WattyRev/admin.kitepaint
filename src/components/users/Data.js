import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import api from '../../api/KitePaintApi';

/**
 * A headless component for managing User data.
 */
const UsersData = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [searchCriteria, setSearchCriteria] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function fetchUsers(criteria, term) {
        setIsLoading(true);
        const resolvedUsers = await api
            .getUsers({
                searchCriteria: criteria || searchCriteria,
                searchTerm: term || searchTerm,
            })
            .catch(() => {});
        setUsers(resolvedUsers);
        setIsLoading(false);
    }

    function search(criteria, term) {
        setSearchCriteria(criteria);
        setSearchTerm(term);
        return fetchUsers(criteria, term);
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
    });
};

UsersData.propTypes = {
    children: PropTypes.func.isRequired,
};

export default UsersData;
