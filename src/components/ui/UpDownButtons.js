import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from 'react-watty-ui';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
`;
const StyledButton = styled(Button)`
    margin: 0;
    height: 20px;
    display: block;
    position: relative;
`;
const UpButton = styled(StyledButton)`
    &:after {
        content: '';
        position: absolute;
        border-bottom: 4px solid black;
        border-right: 4px solid transparent;
        border-left: 4px solid transparent;
        top: calc(50% - 2px);
        left: calc(50% - 4px);
    }
`;
const DownButton = styled(StyledButton)`
    &:after {
        content: '';
        position: absolute;
        border-top: 4px solid black;
        border-right: 4px solid transparent;
        border-left: 4px solid transparent;
        top: calc(50% - 2px);
        left: calc(50% - 4px);
    }
`;

const UpDownButtons = ({ onUp, onDown }) => (
    <Wrapper>
        <UpButton type="button" onClick={onUp} />
        <DownButton type="button" onClick={onDown} />
    </Wrapper>
);

UpDownButtons.propTypes = {
    onUp: PropTypes.func.isRequired,
    onDown: PropTypes.func.isRequired,
};

export default UpDownButtons;
