import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Input } from 'react-watty-ui';

export const DEBOUNCE_MS = 250;

const Results = styled.ul`
    list-style: none;
    margin: 0 0 8px;
    padding: 0;
    max-height: 160px;
    overflow-y: auto;
    border: 1px solid ${({ theme }) => theme.colors.gray};
`;

const Result = styled.li`
    padding: 6px 8px;
    cursor: pointer;
    background: ${({ isActive, theme }) => {
        if (isActive) {
            return theme.colors.silver;
        }
        return 'transparent';
    }};
`;

const LookupResult = ({ result, index, isActive, onPick, onHover }) => (
    <Result
        role="option"
        aria-selected={isActive}
        isActive={isActive}
        data-testid="lookup-result"
        // Selecting on mousedown keeps the input from blurring first.
        onMouseDown={e => {
            e.preventDefault();
            onPick(result);
        }}
        onMouseEnter={() => onHover(index)}
    >
        {result.label}
    </Result>
);

LookupResult.propTypes = {
    result: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string,
        label: PropTypes.string,
    }).isRequired,
    index: PropTypes.number.isRequired,
    isActive: PropTypes.bool.isRequired,
    onPick: PropTypes.func.isRequired,
    onHover: PropTypes.func.isRequired,
};

const Message = styled.div`
    margin: 0 0 8px;
    font-size: 0.875em;
`;

/**
 * A type-ahead field for picking a record by id or by name. The current selection is shown as
 * `label`. Typing searches via `search`, and picking a result calls `onSelect` with its id and
 * name.
 */
const Lookup = ({ id, label, search, onSelect, required, placeholder }) => {
    // The text being typed, or null when the field is showing the current selection.
    const [query, setQuery] = useState(null);
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const latestRequest = useRef(0);

    const trimmedQuery = query === null ? '' : query.trim();

    useEffect(() => {
        latestRequest.current += 1;
        const requestId = latestRequest.current;
        if (!trimmedQuery) {
            setResults([]);
            setIsSearching(false);
            return undefined;
        }
        setIsSearching(true);
        const timeout = setTimeout(async () => {
            let found;
            try {
                found = await search(trimmedQuery);
            } catch {
                found = [];
            }
            // Ignore the response if the query has changed since.
            if (requestId !== latestRequest.current) {
                return;
            }
            setResults(found || []);
            setActiveIndex(0);
            setIsSearching(false);
        }, DEBOUNCE_MS);
        return () => {
            clearTimeout(timeout);
            // Also discards an in-flight search, e.g. when unmounting.
            latestRequest.current += 1;
        };
    }, [trimmedQuery]);

    const reset = () => {
        latestRequest.current += 1;
        setQuery(null);
        setResults([]);
        setIsSearching(false);
    };

    const select = result => {
        onSelect(result.id, result.name);
        reset();
    };

    const handleFocus = e => {
        e.target.select();
    };

    const handleChange = e => {
        setQuery(e.target.value);
    };

    const handleKeyDown = e => {
        if (e.key === 'Escape' && query !== null) {
            e.preventDefault();
            reset();
            return;
        }
        if (results.length === 0) {
            return;
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex(Math.min(activeIndex + 1, results.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex(Math.max(activeIndex - 1, 0));
        } else if (e.key === 'Enter') {
            // Pick the highlighted result instead of submitting the form.
            e.preventDefault();
            select(results[activeIndex]);
        }
    };

    const showNoResults = trimmedQuery && !isSearching && results.length === 0;

    return (
        <div data-testid="lookup">
            <Input
                id={id}
                value={query === null ? label : query}
                required={required}
                placeholder={placeholder}
                autoComplete="off"
                onFocus={handleFocus}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onBlur={reset}
            />
            {results.length > 0 && (
                <Results role="listbox" data-testid="lookup-results">
                    {results.map((result, index) => (
                        <LookupResult
                            key={result.id}
                            result={result}
                            index={index}
                            isActive={index === activeIndex}
                            onPick={select}
                            onHover={setActiveIndex}
                        />
                    ))}
                </Results>
            )}
            {isSearching && <Message>Searching...</Message>}
            {showNoResults && <Message data-testid="lookup-empty">No matches</Message>}
        </div>
    );
};

Lookup.propTypes = {
    id: PropTypes.string,
    /** Text shown for the current selection, e.g. "Void (12)" */
    label: PropTypes.string,
    /** Finds matching records. Resolves to an array of { id, name, label }. */
    search: PropTypes.func.isRequired,
    /** Called with the id and name of the picked record */
    onSelect: PropTypes.func.isRequired,
    required: PropTypes.bool,
    placeholder: PropTypes.string,
};

Lookup.defaultProps = {
    id: undefined,
    label: '',
    required: false,
    placeholder: undefined,
};

export default Lookup;
