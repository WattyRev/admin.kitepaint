import { useEffect, useState } from 'react';
import api from '../../api/KitePaintApi';

const DesignsData = ({ children }) => {
    const [designs, setDesigns] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    async function fetchDesigns() {
        setIsLoading(true);
        const resolvedDesigns = await api.getDesigns().catch(() => {});
        setDesigns(resolvedDesigns);
        setIsLoading(false);
    }

    useEffect(() => {
        fetchDesigns();
    }, []);

    return children({
        designs: designs || [],
        isLoading,
    });
};

export default DesignsData;
