import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import theme from 'react-watty-ui';
import Router from './Router';
import Navigation from './Navigation';
import GlobalStyles from './GlobalStyles';

const FlexWrapper = styled('div')`
    display: flex;
`;

function App() {
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles />
            <FlexWrapper>
                <Router data-testid="router" before={<Navigation />} />
            </FlexWrapper>
        </ThemeProvider>
    );
}

export default App;
