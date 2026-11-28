import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import Lookup from '../Lookup';

const sleep = ms =>
    new Promise(resolve => {
        setTimeout(resolve, ms);
    });

describe('Lookup', () => {
    let defaultProps;
    beforeEach(() => {
        defaultProps = {
            id: 'lookup-input',
            label: 'Void (12)',
            search: jest.fn().mockResolvedValue([
                { id: '12', name: 'Void', label: 'Void (12)' },
                { id: '13', name: 'Voidling', label: 'Voidling (13)' },
            ]),
            onSelect: jest.fn(),
        };
    });
    const type = (input, value) => fireEvent.change(input, { target: { value } });

    it('shows the label of the current selection', () => {
        expect.assertions(1);
        const { getByRole } = renderWithTheme(<Lookup {...defaultProps} />);
        expect(getByRole('textbox')).toHaveValue('Void (12)');
    });
    it('searches for what was typed', async () => {
        expect.hasAssertions();
        const { getByRole } = renderWithTheme(<Lookup {...defaultProps} />);
        type(getByRole('textbox'), ' voi ');
        await waitFor(() => expect(defaultProps.search).toHaveBeenCalledWith('voi'));
    });
    it('does not search when the input is cleared', async () => {
        expect.assertions(2);
        const { getByRole, queryByTestId } = renderWithTheme(<Lookup {...defaultProps} />);
        type(getByRole('textbox'), '');
        await sleep(400);
        expect(defaultProps.search).not.toHaveBeenCalled();
        expect(queryByTestId('lookup-results')).toBeNull();
    });
    it('lists the results', async () => {
        expect.assertions(2);
        const { getByRole, findAllByTestId } = renderWithTheme(<Lookup {...defaultProps} />);
        type(getByRole('textbox'), 'void');
        const results = await findAllByTestId('lookup-result');
        expect(results).toHaveLength(2);
        expect(results[1]).toHaveTextContent('Voidling (13)');
    });
    it('selects the clicked result and shows it again', async () => {
        expect.assertions(3);
        const { getByRole, findAllByTestId, queryByTestId } = renderWithTheme(
            <Lookup {...defaultProps} />
        );
        type(getByRole('textbox'), 'void');
        const results = await findAllByTestId('lookup-result');
        fireEvent.mouseDown(results[1]);
        expect(defaultProps.onSelect).toHaveBeenCalledWith('13', 'Voidling');
        expect(queryByTestId('lookup-results')).toBeNull();
        expect(getByRole('textbox')).toHaveValue('Void (12)');
    });
    it('selects with the keyboard', async () => {
        expect.assertions(1);
        const { getByRole, findAllByTestId } = renderWithTheme(<Lookup {...defaultProps} />);
        const input = getByRole('textbox');
        type(input, 'void');
        await findAllByTestId('lookup-result');
        fireEvent.keyDown(input, { key: 'ArrowDown' });
        fireEvent.keyDown(input, { key: 'Enter' });
        expect(defaultProps.onSelect).toHaveBeenCalledWith('13', 'Voidling');
    });
    it('selects the first result when pressing enter right away', async () => {
        expect.assertions(1);
        const { getByRole, findAllByTestId } = renderWithTheme(<Lookup {...defaultProps} />);
        const input = getByRole('textbox');
        type(input, 'void');
        await findAllByTestId('lookup-result');
        fireEvent.keyDown(input, { key: 'Enter' });
        expect(defaultProps.onSelect).toHaveBeenCalledWith('12', 'Void');
    });
    it('discards what was typed when the input blurs', async () => {
        expect.assertions(3);
        const { getByRole, findAllByTestId, queryByTestId } = renderWithTheme(
            <Lookup {...defaultProps} />
        );
        const input = getByRole('textbox');
        type(input, 'void');
        await findAllByTestId('lookup-result');
        fireEvent.blur(input);
        expect(input).toHaveValue('Void (12)');
        expect(queryByTestId('lookup-results')).toBeNull();
        expect(defaultProps.onSelect).not.toHaveBeenCalled();
    });
    it('discards what was typed when pressing escape', async () => {
        expect.assertions(2);
        const { getByRole, findAllByTestId } = renderWithTheme(<Lookup {...defaultProps} />);
        const input = getByRole('textbox');
        type(input, 'void');
        await findAllByTestId('lookup-result');
        fireEvent.keyDown(input, { key: 'Escape' });
        expect(input).toHaveValue('Void (12)');
        expect(defaultProps.onSelect).not.toHaveBeenCalled();
    });
    it('says when nothing matches', async () => {
        expect.assertions(1);
        defaultProps.search.mockResolvedValue([]);
        const { getByRole, findByTestId } = renderWithTheme(<Lookup {...defaultProps} />);
        type(getByRole('textbox'), 'nobody');
        expect(await findByTestId('lookup-empty')).toBeInTheDocument();
    });
    it('treats a failed search as no matches', async () => {
        expect.assertions(1);
        defaultProps.search.mockRejectedValue(new Error('nope'));
        const { getByRole, findByTestId } = renderWithTheme(<Lookup {...defaultProps} />);
        type(getByRole('textbox'), 'nobody');
        expect(await findByTestId('lookup-empty')).toBeInTheDocument();
    });
    it('ignores results of an outdated search', async () => {
        expect.hasAssertions();
        let resolveFirst;
        defaultProps.search
            .mockImplementationOnce(
                () =>
                    new Promise(resolve => {
                        resolveFirst = resolve;
                    })
            )
            .mockResolvedValueOnce([{ id: '1', name: 'Second', label: 'Second (1)' }]);
        const { getByRole, findAllByTestId } = renderWithTheme(<Lookup {...defaultProps} />);
        const input = getByRole('textbox');
        type(input, 'first');
        await waitFor(() => expect(defaultProps.search).toHaveBeenCalledTimes(1));
        type(input, 'second');
        const results = await findAllByTestId('lookup-result');
        resolveFirst([{ id: '9', name: 'First', label: 'First (9)' }]);
        await sleep(0);
        expect(results[0]).toHaveTextContent('Second (1)');
    });
});
