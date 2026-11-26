import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import api from '../../api/KitePaintApi';
import BackfillPrimary from '../backfill/BackfillPrimary';

jest.mock('../../api/KitePaintApi');

describe('BackfillPrimary', () => {
    beforeEach(() => {
        api.backfillDesignPrimary.mockReset();
    });

    it('renders the run button', () => {
        const { getByTestId } = renderWithTheme(<BackfillPrimary />);
        expect(getByTestId('run-backfill')).toBeInTheDocument();
    });

    it('runs batches, passing the cursor, until none remain', async () => {
        api.backfillDesignPrimary
            .mockResolvedValueOnce({
                valid: true,
                processed: 50,
                changed: 10,
                nextAfterId: 50,
                remaining: 30,
            })
            .mockResolvedValueOnce({
                valid: true,
                processed: 30,
                changed: 5,
                nextAfterId: 80,
                remaining: 0,
            });
        const { getByTestId, findByText } = renderWithTheme(<BackfillPrimary />);

        fireEvent.click(getByTestId('run-backfill'));

        expect(await findByText(/Processed 80 designs, 15 updated\. Done\./)).toBeInTheDocument();
        expect(api.backfillDesignPrimary).toHaveBeenNthCalledWith(1, 0);
        expect(api.backfillDesignPrimary).toHaveBeenNthCalledWith(2, 50);
        expect(api.backfillDesignPrimary).toHaveBeenCalledTimes(2);
    });

    it('stops when a batch processes nothing', async () => {
        api.backfillDesignPrimary.mockResolvedValueOnce({
            valid: true,
            processed: 0,
            changed: 0,
            nextAfterId: 0,
            remaining: 5,
        });
        const { getByTestId, findByTestId } = renderWithTheme(<BackfillPrimary />);

        fireEvent.click(getByTestId('run-backfill'));

        const progress = await findByTestId('backfill-progress');
        expect(progress).toHaveTextContent('Processed 0 designs, 0 updated. 5 remaining.');
        await waitFor(() => expect(getByTestId('run-backfill')).not.toBeDisabled());
        expect(api.backfillDesignPrimary).toHaveBeenCalledTimes(1);
    });

    it('stops with the error when a batch fails', async () => {
        api.backfillDesignPrimary.mockRejectedValueOnce(new Error('boom'));
        const { getByTestId } = renderWithTheme(<BackfillPrimary />);

        fireEvent.click(getByTestId('run-backfill'));

        await waitFor(() => expect(getByTestId('run-backfill')).not.toBeDisabled());
        expect(api.backfillDesignPrimary).toHaveBeenCalledTimes(1);
    });
});
