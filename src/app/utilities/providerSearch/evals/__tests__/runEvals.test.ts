import { formatReport, runEvals } from '../runEvals';

describe('search intent evals', () => {
  it('passes every offline threshold and keeps the golden counts honest', async () => {
    const report = await runEvals({ mode: 'offline' });

    expect(report.breaches).toEqual([]);

    const counted = report.cases.reduce<Record<string, number>>((counts, evalCase) => {
      counts[evalCase.category] = (counts[evalCase.category] ?? 0) + 1;
      return counts;
    }, {});
    expect(report.counts).toEqual(counted);
  });

  it('resolves area-only queries without a location', async () => {
    const report = await runEvals({ mode: 'offline' });
    const areaCases = report.cases.filter((evalCase) => evalCase.category === 'area');

    expect(areaCases).not.toHaveLength(0);
    expect(areaCases.filter((evalCase) => !evalCase.passed)).toEqual([]);
    expect(areaCases.every((evalCase) => (evalCase.resultCount ?? 0) > 0)).toBe(true);
  });

  it('reports area-only coverage in the generated markdown', async () => {
    const report = await runEvals({ mode: 'offline' });
    const markdown = formatReport(report);

    expect(markdown).toContain('area-only');
    expect(markdown).toContain('area-only routing');
    expect(markdown).toContain('all measured thresholds met');
  });
});
