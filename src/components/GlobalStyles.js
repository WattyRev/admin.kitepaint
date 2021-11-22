import { createGlobalStyle } from 'styled-components';

/**
 * Provides gloabl styles that otherwise cannot be attained by styled components
 */
const GlobalStyle = createGlobalStyle`
    body {
        overflow: hidden;
        margin: 0;
    }
`;

export default GlobalStyle;
