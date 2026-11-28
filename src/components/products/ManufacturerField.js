import React, { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import api from '../../api/KitePaintApi';
import { formatNameWithId } from '../../models/Design';
import Lookup from '../ui/Lookup';

export const MAX_RESULTS = 20;

/** Loads every manufacturer, or resolves to null when the request fails. */
async function loadManufacturers() {
    try {
        return (await api.getManufacturers()) || [];
    } catch {
        return null;
    }
}

/**
 * Picks a manufacturer by id or name. The manufacturers are loaded once, the first time the user
 * searches, and then filtered in the browser.
 */
const ManufacturerField = ({ id, manufacturer, manufacturerName, onChange, required }) => {
    const manufacturers = useRef(null);

    /** Finds manufacturers by id or name, in the shape that Lookup expects. */
    const searchManufacturers = useCallback(async term => {
        if (!manufacturers.current) {
            manufacturers.current = loadManufacturers().then(loaded => {
                if (loaded === null) {
                    // Allow the next search to try again.
                    manufacturers.current = null;
                }
                return loaded || [];
            });
        }
        const loaded = await manufacturers.current;
        const lowerTerm = term.toLowerCase();
        return loaded
            .filter(
                item =>
                    String(item.get('id')) === term ||
                    (item.get('name') || '').toLowerCase().includes(lowerTerm)
            )
            .sort((a, b) => {
                // An exact id match always comes first.
                const aIsExact = String(a.get('id')) === term;
                const bIsExact = String(b.get('id')) === term;
                if (aIsExact !== bIsExact) {
                    return aIsExact ? -1 : 1;
                }
                return (a.get('name') || '').localeCompare(b.get('name') || '');
            })
            .slice(0, MAX_RESULTS)
            .map(item => ({
                id: String(item.get('id')),
                name: item.get('name'),
                label: formatNameWithId(item.get('name'), item.get('id')),
            }));
    }, []);

    return (
        <Lookup
            id={id}
            required={required}
            placeholder="Search by manufacturer ID or name"
            label={formatNameWithId(manufacturerName, manufacturer)}
            search={searchManufacturers}
            onSelect={onChange}
        />
    );
};

ManufacturerField.propTypes = {
    id: PropTypes.string,
    /** The id of the selected manufacturer */
    manufacturer: PropTypes.string,
    /** The name of the selected manufacturer */
    manufacturerName: PropTypes.string,
    /** Called with the id and name of the picked manufacturer */
    onChange: PropTypes.func.isRequired,
    required: PropTypes.bool,
};

ManufacturerField.defaultProps = {
    id: undefined,
    manufacturer: '',
    manufacturerName: '',
    required: false,
};

export default ManufacturerField;
