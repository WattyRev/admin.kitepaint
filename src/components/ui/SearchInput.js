import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'react-watty-ui';

export const SEARCH_DEBOUNCE_MS = 300;

/**
 * A text input that searches as you type. The text updates immediately through `onValueChange`,
 * and `onSearch` is called with the text once the user stops typing for `delay` milliseconds.
 */
const SearchInput = ({ value, onValueChange, onSearch, delay, ...props }) => {
    const timer = useRef(null);
    const lastSearched = useRef(value);
    // Always call the latest onSearch, since it closes over the current search criteria.
    const latestOnSearch = useRef(onSearch);
    latestOnSearch.current = onSearch;

    // Don't search after the input has gone away.
    useEffect(() => () => clearTimeout(timer.current), []);

    function handleChange(e) {
        const term = e.target.value;
        onValueChange(term);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            // Skip the request if the text is back to what was last searched for.
            if (term === lastSearched.current) {
                return;
            }
            lastSearched.current = term;
            latestOnSearch.current(term);
        }, delay);
    }

    return <Input {...props} value={value} onChange={e => handleChange(e)} />;
};

SearchInput.propTypes = {
    value: PropTypes.string,
    onValueChange: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    delay: PropTypes.number,
};

SearchInput.defaultProps = {
    value: '',
    delay: SEARCH_DEBOUNCE_MS,
};

export default SearchInput;
