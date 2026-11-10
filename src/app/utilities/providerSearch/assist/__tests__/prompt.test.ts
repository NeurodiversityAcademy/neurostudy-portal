import { buildAssistSystemPrompt } from '../prompt';

describe('buildAssistSystemPrompt', () => {
  it('lists the catalog so the model can map synonyms itself', () => {
    const prompt = buildAssistSystemPrompt({
      providers: [],
      interestAreaCatalog: ['Nursing', 'Arts', 'Creative Industries'],
      locationCatalog: ['Melbourne', 'VIC'],
    });

    expect(prompt).toContain('Allowed areas: Nursing; Arts; Creative Industries.');
    expect(prompt).toContain('Allowed locations: Melbourne; VIC.');
    expect(prompt).toContain('synonym');
    expect(prompt).toContain('Never return an area or location that is not in the allowed lists.');
  });

  it('asks the model to report words it could not map', () => {
    const prompt = buildAssistSystemPrompt();

    // Without this, a query the model only partly understood looks successful.
    expect(prompt).toContain('"unmatched"');
    expect(prompt).toContain('{"area": null, "location": "NSW", "unmatched": ["asdfgh"]}');
  });

  it('stays usable without a catalog for offline callers', () => {
    const prompt = buildAssistSystemPrompt();

    expect(prompt).not.toContain('Allowed areas');
    expect(prompt).toContain('Return only valid JSON with keys: area, location, unmatched.');
  });
});
