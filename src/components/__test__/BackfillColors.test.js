import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import api from '../../api/KitePaintApi';
import BackfillColors from '../backfill/BackfillColors';

jest.mock('../../api/KitePaintApi');

describe('BackfillColors', () => {
    beforeEach(() => {
        api.backfillDesignColors.mockReset();
    });

    it('renders the run button', () => {
        const { getByTestId } = renderWithTheme(<BackfillColors />);
        expect(getByTestId('run-backfill')).toBeInTheDocument();
    });

    it('runs batches, passing the cursor, until none remain', async () => {
        api.backfillDesignColors
            .mockResolvedValueOnce({ valid: true, processed: 50, nextAfterId: 50, remaining: 30 })
            .mockResolvedValueOnce({ valid: true, processed: 30, nextAfterId: 80, remaining: 0 });
        const { getByTestId, findByText } = renderWithTheme(<BackfillColors />);

        fireEvent.click(getByTestId('run-backfill'));

        expect(await findByText(/Processed 80 designs\. Done\./)).toBeInTheDocument();
        expect(api.backfillDesignColors).toHaveBeenNthCalledWith(1, 0);
        expect(api.backfillDesignColors).toHaveBeenNthCalledWith(2, 50);
        expect(api.backfillDesignColors).toHaveBeenCalledTimes(2);
    });

    it('stops when a batch processes nothing', async () => {
        api.backfillDesignColors.mockResolvedValueOnce({
            valid: true,
            processed: 0,
            nextAfterId: 0,
            remaining: 5,
        });
        const { getByTestId, findByTestId } = renderWithTheme(<BackfillColors />);

        fireEvent.click(getByTestId('run-backfill'));

        const progress = await findByTestId('backfill-progress');
        expect(progress).toHaveTextContent('Processed 0 designs. 5 remaining.');
        await waitFor(() => expect(getByTestId('run-backfill')).not.toBeDisabled());
        expect(api.backfillDesignColors).toHaveBeenCalledTimes(1);
    });

    it('stops with the error when a batch fails', async () => {
        api.backfillDesignColors.mockRejectedValueOnce(new Error('boom'));
        const { getByTestId } = renderWithTheme(<BackfillColors />);

        fireEvent.click(getByTestId('run-backfill'));

        await waitFor(() => expect(getByTestId('run-backfill')).not.toBeDisabled());
        expect(api.backfillDesignColors).toHaveBeenCalledTimes(1);
    });
});
