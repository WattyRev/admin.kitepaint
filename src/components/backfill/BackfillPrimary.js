import React, { useState } from 'react';
import { Button, H1, Spacer } from 'react-watty-ui';
import PageWrapper from '../ui/PageWrapper';
import api from '../../api/KitePaintApi';

/**
 * Re-picks the primary variation (the thumbnail) of existing designs so that it is a colored
 * variation instead of a blank one. Runs one batch at a time until the API reports that no designs
 * remain. Safe to run again.
 */
const BackfillPrimary = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const [processed, setProcessed] = useState(0);
    const [changed, setChanged] = useState(0);
    const [remaining, setRemaining] = useState(null);

    const runBackfill = async () => {
        setIsRunning(true);
        setIsDone(false);
        setProcessed(0);
        setChanged(0);
        setRemaining(null);
        let afterId = 0;
        let total = 0;
        let totalChanged = 0;
        let left = 1;
        try {
            while (left > 0) {
                // eslint-disable-next-line no-await-in-loop
                const result = await api.backfillDesignPrimary(afterId);
                total += result.processed;
                totalChanged += result.changed;
                afterId = result.nextAfterId;
                left = result.remaining;
                setProcessed(total);
                setChanged(totalChanged);
                setRemaining(left);
                // Nothing was processed, so stop rather than loop on the same batch.
                if (result.processed === 0) {
                    break;
                }
            }
            setIsDone(left === 0);
        } catch (e) {
            // The API already showed the error message.
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <PageWrapper>
            <H1>Backfill design thumbnails</H1>
            <Spacer bottom="md" as="div" />
            <p>
                Picks the most colored variation of every existing design as its thumbnail, so
                designs no longer show a blank variation. Designs saved from now on are handled
                automatically.
            </p>
            <Spacer bottom="md" as="div" />
            <Button data-testid="run-backfill" disabled={isRunning} onClick={runBackfill}>
                {isRunning ? 'Running…' : 'Run backfill'}
            </Button>
            <Spacer top="md" as="div" />
            {remaining !== null ? (
                <p data-testid="backfill-progress">
                    Processed {processed} designs, {changed} updated.
                    {remaining > 0 ? ` ${remaining} remaining.` : ''}
                    {isDone ? ' Done.' : ''}
                </p>
            ) : null}
        </PageWrapper>
    );
};

export default BackfillPrimary;
