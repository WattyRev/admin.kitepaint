import { createGlobalStyle } from 'styled-components';

/**
 * Provides gloabl styles that otherwise cannot be attained by styled components
 */
const GlobalStyle = createGlobalStyle`
    body {
        overflow: hidden;
        margin: 0;
    }

    /* Browsers center table headings by default, but the cells under them are left-aligned. */
    th {
        text-align: left;
    }
`;

export default GlobalStyle;
