import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Textarea, Button, Input, TextButton, error } from 'react-watty-ui';

const Flex = styled.div`
    display: flex;
`;

const ColorsField = ({ colors, onChange }) => {
    const [editAsText, setEditAsText] = useState(false);
    const [colorsString, setColorsString] = useState(JSON.stringify(colors));

    useEffect(() => {
        if (!editAsText) {
            setColorsString(JSON.stringify(colors));
        }
    });

    if (editAsText) {
        return (
            <React.Fragment>
                <Textarea
                    value={colorsString}
                    onChange={e => setColorsString(e.target.value)}
                    onBlur={e => {
                        let newColors;
                        try {
                            newColors = JSON.parse(e.target.value);
                        } catch {
                            error('Could not parse colors JSON');
                            return;
                        }
                        onChange(newColors);
                    }}
                />
                <TextButton type="button" onClick={() => setEditAsText(false)}>
                    Use Full UI
                </TextButton>
            </React.Fragment>
        );
    }
    return (
        <React.Fragment>
            {colors.map((color, index) => (
                <Flex key={index}>
                    <Button
                        type="button"
                        onClick={() => onChange(colors.filter((_, _index) => index !== _index))}
                    >
                        X
                    </Button>
                    <Input
                        value={color.name}
                        onChange={e => {
                            const newName = e.target.value;
                            color.name = newName;
                            onChange(colors);
                        }}
                        placeholder="Name"
                    />
                    <Input
                        value={color.color}
                        onChange={e => {
                            const newColor = e.target.value;
                            color.color = newColor;
                            onChange(colors);
                        }}
                        placeholder="Hexidecimal"
                    />
                </Flex>
            ))}
            <Button type="button" onClick={() => onChange([...colors, { name: '', color: '' }])}>
                Add
            </Button>
            <br />
            <TextButton type="button" onClick={() => setEditAsText(true)}>
                Edit as Text
            </TextButton>
        </React.Fragment>
    );
};

ColorsField.propTypes = {
    colors: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            color: PropTypes.string.isRequired,
        })
    ).isRequired,
    onChange: PropTypes.func.isRequired,
};

export default ColorsField;
