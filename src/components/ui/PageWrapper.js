import styled from 'styled-components';

/** Height of the fixed mobile navigation bar (see Navigation.js) */
export const MOBILE_BAR_HEIGHT = 56;

const PageWrapper = styled.article`
    height: 100vh;
    height: 100dvh;
    flex-grow: 1;
    min-width: 0;
    overflow: auto;
    padding: 20px;
    box-sizing: border-box;

    @media (max-width: 768px) {
        padding-top: ${MOBILE_BAR_HEIGHT + 20}px;
        padding-bottom: calc(20px + env(safe-area-inset-bottom, 0px));
    }
`;

export default PageWrapper;
