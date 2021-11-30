import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Input } from 'react-watty-ui';
import generateId from '../../util/generateId';
import UpDownButtons from '../ui/UpDownButtons';

const Flex = styled.div`
    display: flex;
`;

const VariationsField = ({ variations, onChange }) => (
    <React.Fragment>
        {variations.map(variation => (
            <Flex key={variation.id}>
                <Button
                    type="button"
                    aria-label="Remove Variation"
                    onClick={() =>
                        onChange(variations.filter(_variation => variation.id !== _variation.id))
                    }
                >
                    X
                </Button>
                <Input
                    placeholder="Name"
                    value={variation.name}
                    required
                    onChange={e => {
                        variation.name = e.target.value;
                        onChange(variations);
                    }}
                />
                <Input
                    placeholder="SVG"
                    required
                    value={variation.svg}
                    onChange={e => {
                        variation.svg = e.target.value;
                        onChange(variations);
                    }}
                />
                <UpDownButtons
                    onUp={() => {
                        const newIndex = variation.sortIndex - 1;
                        if (newIndex === -1) {
                            return;
                        }
                        let updatedVariations = variations.filter(
                            _variation => _variation.id !== variation.id
                        );
                        updatedVariations.splice(newIndex, 0, variation);
                        updatedVariations = updatedVariations.map((_variation, index) => ({
                            ..._variation,
                            sortIndex: index,
                        }));
                        onChange(updatedVariations);
                    }}
                    onDown={() => {
                        const newIndex = variation.sortIndex + 1;
                        if (newIndex === variations.length) {
                            return;
                        }
                        let updatedVariations = variations.filter(
                            _variation => _variation.id !== variation.id
                        );
                        updatedVariations.splice(newIndex, 0, variation);
                        updatedVariations = updatedVariations.map((_variation, index) => ({
                            ..._variation,
                            sortIndex: index,
                        }));
                        onChange(updatedVariations);
                    }}
                />
            </Flex>
        ))}
        <Button
            type="button"
            onClick={() =>
                onChange([
                    ...variations,
                    {
                        id: generateId(),
                        name: '',
                        sortIndex: variations.length,
                        svg: '',
                    },
                ])
            }
        >
            Add Variation
        </Button>
    </React.Fragment>
);

VariationsField.propTypes = {
    variations: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
            sortIndex: PropTypes.number,
            svg: PropTypes.string,
        })
    ).isRequired,
    onChange: PropTypes.func.isRequired,
};

export default VariationsField;
