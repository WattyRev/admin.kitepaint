import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import api from '../../api/KitePaintApi';

export const RECENT_COUNT = 5;

/**
 * A headless component for loading the data shown on the dashboard. The stats, recent users, and
 * recent designs are requested independently, so one failing doesn't blank the others.
 */
const DashboardData = ({ children }) => {
    const [stats, setStats] = useState(null);
    const [recentUsers, setRecentUsers] = useState([]);
    const [recentDesigns, setRecentDesigns] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const latestRequest = useRef(0);

    async function refresh() {
        latestRequest.current += 1;
        const requestId = latestRequest.current;
        setIsLoading(true);
        const [statsResult, usersResult, designsResult] = await Promise.all([
            api.getDashboardStats().catch(() => undefined),
            api
                .getUsers({
                    page: 1,
                    pageSize: RECENT_COUNT,
                    sortBy: 'create_time',
                    sortDirection: 'DESC',
                })
                .catch(() => undefined),
            api
                .getDesigns({
                    page: 1,
                    pageSize: RECENT_COUNT,
                    sortBy: 'created',
                    sortDirection: 'DESC',
                })
                .catch(() => undefined),
        ]);
        // Ignore the responses if a newer request has been made since.
        if (requestId !== latestRequest.current) {
            return;
        }
        setStats(statsResult || null);
        setRecentUsers((usersResult && usersResult.users) || []);
        setRecentDesigns((designsResult && designsResult.designs) || []);
        setIsLoading(false);
    }

    useEffect(() => {
        refresh();
    }, []);

    return children({
        stats,
        recentUsers,
        recentDesigns,
        isLoading,
        refresh,
    });
};

DashboardData.propTypes = {
    children: PropTypes.func.isRequired,
};

export default DashboardData;
