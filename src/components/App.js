import React, { useEffect, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import theme, { setupFontAwesome, Alert } from 'react-watty-ui';
import api from '../api/KitePaintApi';
import Router from './Router';
import Navigation from './Navigation';
import GlobalStyles from './GlobalStyles';

setupFontAwesome();

const FlexWrapper = styled('div')`
    display: flex;
`;

function App() {
    const [pinged, setPinged] = useState(false);
    useEffect(() => {
        api.ping().then(() => {
            setPinged(true);
        });
    }, []);
    if (!pinged) {
        return <div />;
    }
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles />
            <FlexWrapper>
                <Router data-testid="router" before={<Navigation />} />
            </FlexWrapper>
            <Alert />
        </ThemeProvider>
    );
}

export default App;
