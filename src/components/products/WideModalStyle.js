import { createGlobalStyle } from 'styled-components';

/**
 * react-watty-ui's Modal is capped at 300px wide and doesn't expose a way to change that. Render
 * this inside a Modal's children to widen it for as long as it's open. The width shrinks to fit
 * on screens that are too small.
 */
const WideModalStyle = createGlobalStyle`
    .testing_modal.testing_modal {
        box-sizing: border-box;
        width: 600px;
        max-width: calc(100vw - 32px);
    }
`;

export default WideModalStyle;
