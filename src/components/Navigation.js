import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { NavLink, useLocation } from 'react-router-dom';
import { BlockListItem } from 'react-watty-ui';
import { MOBILE_BAR_HEIGHT } from './ui/PageWrapper';

const MOBILE_QUERY = '@media (max-width: 768px)';

/**
 * A styled wrapper around the navigation to provide background and sizing.
 * On mobile it becomes a slide-over drawer.
 */
const Wrapper = styled.aside`
    height: 100vh;
    height: 100dvh;
    box-sizing: border-box;
    background: ${({ theme }) => theme.colors.silver};

    ${MOBILE_QUERY} {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 30;
        width: 260px;
        max-width: 80vw;
        overflow-y: auto;
        transform: translateX(-100%);
        visibility: hidden;
        transition: transform 0.25s ease, visibility 0s linear 0.25s;

        ${({ $open }) =>
            $open &&
            css`
                transform: translateX(0);
                visibility: visible;
                transition: transform 0.25s ease, visibility 0s linear 0s;
            `}
    }
`;

/**
 * Slim top bar containing the menu button. Only shown on mobile.
 */
const TopBar = styled.header`
    display: none;

    ${MOBILE_QUERY} {
        display: flex;
        align-items: center;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 10;
        height: ${MOBILE_BAR_HEIGHT}px;
        padding: 0 10px;
        box-sizing: border-box;
        background: ${({ theme }) => theme.colors.silver};
        border-bottom: 1px solid rgba(0, 0, 0, 0.15);
    }
`;

const MenuButton = styled.button`
    width: 40px;
    height: 40px;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
    font-size: 24px;
    line-height: 1;
`;

/**
 * Dims the page behind the open drawer. Only shown on mobile.
 */
const Backdrop = styled.div`
    display: none;

    ${MOBILE_QUERY} {
        ${({ $open }) =>
            $open &&
            css`
                display: block;
            `}
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 20;
        background: rgba(0, 0, 0, 0.4);
    }
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
 * The navigation sidebar component. Provides the primary navigation for the app.
 * On narrow screens it collapses into a drawer opened from a top bar.
 */
const Navigation = () => {
    const [open, setOpen] = useState(false);
    const { pathname } = useLocation();

    // Close the drawer whenever the route changes
    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    const close = () => setOpen(false);

    return (
        <React.Fragment>
            <TopBar>
                <MenuButton
                    type="button"
                    aria-label="Toggle navigation"
                    aria-expanded={open}
                    onClick={() => setOpen(!open)}
                >
                    &#9776;
                </MenuButton>
            </TopBar>
            <Backdrop $open={open} data-testid="nav-backdrop" onClick={close} />
            <Wrapper $open={open} data-testid="nav-drawer" onClick={close}>
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
        </React.Fragment>
    );
};

export default Navigation;
