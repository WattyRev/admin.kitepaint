import React from 'react';
import { act, fireEvent } from '@testing-library/react';
import theme from 'react-watty-ui';
import { ThemeProvider } from 'styled-components';
import SearchInput from '../SearchInput';

describe('SearchInput', () => {
    let onValueChange;
    let onSearch;
    beforeEach(() => {
        jest.useFakeTimers();
        onValueChange = jest.fn();
        onSearch = jest.fn();
    });
    afterEach(() => {
        jest.useRealTimers();
    });

    function renderInput(props = {}) {
        return renderWithTheme(
            <SearchInput
                data-testid="input"
                value=""
                onValueChange={onValueChange}
                onSearch={onSearch}
                {...props}
            />
        );
    }

    function type(element, value) {
        fireEvent.change(element, { target: { value } });
    }

    function wait(ms) {
        act(() => {
            jest.advanceTimersByTime(ms);
        });
    }

    it('updates the value immediately', () => {
        expect.assertions(2);
        const { getByTestId } = renderInput();
        type(getByTestId('input'), 'a');
        expect(onValueChange).toHaveBeenCalledWith('a');
        expect(onSearch).not.toHaveBeenCalled();
    });
    it('searches 300ms after the last change', () => {
        expect.assertions(3);
        const { getByTestId } = renderInput();
        type(getByTestId('input'), 'abc');
        wait(299);
        expect(onSearch).not.toHaveBeenCalled();
        wait(1);
        expect(onSearch).toHaveBeenCalledTimes(1);
        expect(onSearch).toHaveBeenCalledWith('abc');
    });
    it('restarts the wait on each change and only searches for the latest text', () => {
        expect.assertions(2);
        const { getByTestId } = renderInput();
        type(getByTestId('input'), 'a');
        wait(200);
        type(getByTestId('input'), 'ab');
        wait(200);
        expect(onSearch).not.toHaveBeenCalled();
        wait(100);
        expect(onSearch).toHaveBeenCalledWith('ab');
    });
    it('does not search again when the text returns to what was last searched', () => {
        expect.assertions(1);
        const { getByTestId } = renderInput();
        type(getByTestId('input'), 'a');
        wait(300);
        type(getByTestId('input'), 'ab');
        type(getByTestId('input'), 'a');
        wait(300);
        expect(onSearch).toHaveBeenCalledTimes(1);
    });
    it('does not search on blur', () => {
        expect.assertions(1);
        const { getByTestId } = renderInput();
        fireEvent.blur(getByTestId('input'), { target: { value: 'a' } });
        wait(1000);
        expect(onSearch).not.toHaveBeenCalled();
    });
    it('does not search after unmounting', () => {
        expect.assertions(1);
        const { getByTestId, unmount } = renderInput();
        type(getByTestId('input'), 'a');
        unmount();
        wait(1000);
        expect(onSearch).not.toHaveBeenCalled();
    });
    it('uses the latest onSearch', () => {
        expect.assertions(2);
        const newOnSearch = jest.fn();
        const { getByTestId, rerender } = renderInput();
        type(getByTestId('input'), 'a');
        rerender(
            <ThemeProvider theme={theme}>
                <SearchInput
                    data-testid="input"
                    value="a"
                    onValueChange={onValueChange}
                    onSearch={newOnSearch}
                />
            </ThemeProvider>
        );
        wait(300);
        expect(onSearch).not.toHaveBeenCalled();
        expect(newOnSearch).toHaveBeenCalledWith('a');
    });
});
