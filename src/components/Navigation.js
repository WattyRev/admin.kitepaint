import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { BlockListItem } from 'react-watty-ui';

/**
 * A styled wrapper around the navigation to provide background and sizing
 */
const Wrapper = styled.aside`
    height: 100vh;
    box-sizing: border-box;
    background: ${({ theme }) => theme.colors.silver};
`;

/**
 * An invdividual styled navigation item, provides hover and active state UI
 * @type {[type]}
 */
const Item = styled(BlockListItem)`
    position: relative;
    padding-right: 20px;

    &:hover {
        &:after {
            content: '';
            width: 10px;
            height: 100%;
            position: absolute;
            top: 0;
            right: 0;
            background: ${({ theme }) => theme.colors.white};
        }
    }

    &.active {
        &:after {
            content: '';
            width: 10px;
            height: 100%;
            position: absolute;
            top: 0;
            right: 0;
            background: ${({ theme }) => theme.colors.blue};
        }
    }
`;

/**
 * The navigation sidebar component. Provides the primary navigation for the app
 */
const Navigation = () => (
    <Wrapper>
        <Item as={NavLink} to="/">
            Dashboard
        </Item>
        <Item as={NavLink} to="/designs">
            Designs
        </Item>
        <Item as={NavLink} to="/products">
            Products
        </Item>
        <Item as={NavLink} to="/manufacturers">
            Manufacturers
        </Item>
        <Item as={NavLink} to="/users">
            Users
        </Item>
    </Wrapper>
);

export default Navigation;
