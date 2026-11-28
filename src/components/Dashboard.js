import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { PageLoader, Table, TableHeading, TableRow, H1, H2, Spacer } from 'react-watty-ui';
import PageWrapper from './ui/PageWrapper';
import DashboardData from './dashboard/Data';
import DesignsEdit from './designs/Edit';
import DesignsRow from './designs/Row';
import UsersEdit from './users/Edit';
import UsersRow from './users/Row';

const StatGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    margin-bottom: 24px;

    @media (max-width: 768px) {
        grid-template-columns: minmax(0, 1fr);
    }
`;

const StatCard = styled.div`
    padding: 16px 20px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    background: ${({ theme }) => theme.colors.silver};
`;

const StatLabel = styled.div`
    font-size: 14px;
    opacity: 0.75;
`;

const StatValue = styled.div`
    margin-top: 4px;
    font-size: 32px;
    font-weight: bold;
`;

const SectionHeader = styled.div`
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 8px;
`;

const Section = styled.section`
    margin-bottom: 40px;
`;

const TableScroller = styled.div`
    overflow-x: auto;
`;

const Stat = ({ label, value, testId }) => (
    <StatCard data-testid={testId}>
        <StatLabel>{label}</StatLabel>
        <StatValue data-testid={`${testId}-value`}>
            {value === null || value === undefined ? '-' : Number(value).toLocaleString()}
        </StatValue>
    </StatCard>
);

Stat.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.number,
    testId: PropTypes.string.isRequired,
};

Stat.defaultProps = {
    value: null,
};

const Dashboard = () => {
    const [editedUser, setEditedUser] = useState(null);
    const [editedDesign, setEditedDesign] = useState(null);
    return (
        <PageWrapper>
            <H1>Dashboard</H1>
            <Spacer bottom="md" as="div" />
            <DashboardData>
                {({ stats, recentUsers, recentDesigns, isLoading, refresh }) => {
                    const userStats = (stats && stats.users) || {};
                    const designStats = (stats && stats.designs) || {};
                    return (
                        <React.Fragment>
                            <Section data-testid="users-section">
                                <H2>Users</H2>
                                <StatGrid>
                                    <Stat
                                        testId="stat-users-total"
                                        label="Total accounts"
                                        value={userStats.total}
                                    />
                                    <Stat
                                        testId="stat-users-active30"
                                        label="Active in the last 30 days"
                                        value={userStats.active30}
                                    />
                                    <Stat
                                        testId="stat-users-active365"
                                        label="Active in the last year"
                                        value={userStats.active365}
                                    />
                                </StatGrid>
                                <SectionHeader>
                                    <strong>Recently registered</strong>
                                    <Link to="/users">View all users</Link>
                                </SectionHeader>
                                {isLoading && <PageLoader data-testid="loading-users" />}
                                {!isLoading && (
                                    <TableScroller>
                                        <Table data-testid="recent-users-table">
                                            <thead>
                                                <TableRow>
                                                    <TableHeading>ID</TableHeading>
                                                    <TableHeading>Username</TableHeading>
                                                    <TableHeading>Email</TableHeading>
                                                    <TableHeading>Created</TableHeading>
                                                    <TableHeading>Activated</TableHeading>
                                                    <TableHeading />
                                                    <TableHeading />
                                                </TableRow>
                                            </thead>
                                            <tbody>
                                                {recentUsers.map(user => (
                                                    <UsersRow
                                                        key={user.get('loginid')}
                                                        user={user}
                                                        showLastLogin={false}
                                                        onEdit={setEditedUser}
                                                        onSubmit={() => refresh()}
                                                    />
                                                ))}
                                            </tbody>
                                        </Table>
                                    </TableScroller>
                                )}
                            </Section>
                            <Section data-testid="designs-section">
                                <H2>Designs</H2>
                                <StatGrid>
                                    <Stat
                                        testId="stat-designs-total"
                                        label="Total designs"
                                        value={designStats.total}
                                    />
                                    <Stat
                                        testId="stat-designs-created30"
                                        label="Created in the last 30 days"
                                        value={designStats.created30}
                                    />
                                    <Stat
                                        testId="stat-designs-created60"
                                        label="Created in the last 60 days"
                                        value={designStats.created60}
                                    />
                                </StatGrid>
                                <SectionHeader>
                                    <strong>Recently created</strong>
                                    <Link to="/designs">View all designs</Link>
                                </SectionHeader>
                                {isLoading && <PageLoader data-testid="loading-designs" />}
                                {!isLoading && (
                                    <TableScroller>
                                        <Table data-testid="recent-designs-table">
                                            <thead>
                                                <TableRow>
                                                    <TableHeading>ID</TableHeading>
                                                    <TableHeading>Name</TableHeading>
                                                    <TableHeading>Created</TableHeading>
                                                    <TableHeading>Status</TableHeading>
                                                    <TableHeading>User</TableHeading>
                                                    <TableHeading>Product</TableHeading>
                                                    <TableHeading>Active</TableHeading>
                                                    <TableHeading />
                                                </TableRow>
                                            </thead>
                                            <tbody>
                                                {recentDesigns.map(design => (
                                                    <DesignsRow
                                                        key={design.get('id')}
                                                        design={design}
                                                        showUpdated={false}
                                                        onEdit={setEditedDesign}
                                                    />
                                                ))}
                                            </tbody>
                                        </Table>
                                    </TableScroller>
                                )}
                            </Section>
                            <UsersEdit
                                user={editedUser}
                                onClose={() => setEditedUser(null)}
                                onSubmit={() => refresh()}
                            />
                            <DesignsEdit
                                design={editedDesign}
                                onClose={() => setEditedDesign(null)}
                                onSubmit={() => refresh()}
                            />
                        </React.Fragment>
                    );
                }}
            </DashboardData>
        </PageWrapper>
    );
};

export default Dashboard;
