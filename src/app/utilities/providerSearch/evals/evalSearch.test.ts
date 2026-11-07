import { formatReport, runEvals, writeLatestReport } from './runEvals';

const requested = process.env.EVAL_SEARCH_MODE;
const mode = requested === 'live' ? 'live' : requested === 'offline' ? 'offline' : null;

// Skipped during the normal suite; `npm run eval:search` sets EVAL_SEARCH_MODE.
const describeEval = mode ? describe : describe.skip;

describeEval('search intent evals', () => {
  it('meets the extraction, keyword, refusal, zero-result and top-3 thresholds', async () => {
    const report = await runEvals({ mode: mode ?? 'offline' });
    const markdown = formatReport(report);
    writeLatestReport(markdown);

    if (report.breaches.length > 0) {
      throw new Error(
        `Search eval thresholds breached:\n${report.breaches.join('\n')}\n\n${markdown}`,
      );
    }

    expect(report.breaches).toEqual([]);
  }, 180_000);
});
