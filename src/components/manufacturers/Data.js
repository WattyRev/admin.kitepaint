import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import api from '../../api/KitePaintApi';

/**
 * A headless component for managing Manufacturer data.
 */
const ManufacturersData = ({ children }) => {
    const [manufacturers, setManufacturers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    async function fetchManufacturers() {
        setIsLoading(true);
        const resolvedManufacturers = await api.getManufacturers().catch(() => {});
        setManufacturers(resolvedManufacturers);
        setIsLoading(false);
    }

    useEffect(() => {
        fetchManufacturers();
    }, []);

    return children({
        manufacturers: manufacturers || [],
        isLoading,
        refresh: fetchManufacturers,
    });
};

ManufacturersData.propTypes = {
    children: PropTypes.func.isRequired,
};

export default ManufacturersData;
