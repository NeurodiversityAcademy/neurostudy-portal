import { buildUnmatchedMessage } from '../unmatchedMessage';

describe('buildUnmatchedMessage', () => {
  it('names the unmatched words and prefers the state over its city', () => {
    expect(buildUnmatchedMessage(['asdfgh'], ['NSW', 'Sydney'])).toBe(
      "We couldn't match “asdfgh” to an area of study — showing all results in NSW.",
    );
  });

  it('lists several unmatched words and omits the scope when there is none', () => {
    expect(buildUnmatchedMessage(['asdfgh', 'qwerty'], [])).toBe(
      "We couldn't match “asdfgh”, “qwerty” to an area of study — showing all results.",
    );
  });

  it('returns null when every word was understood', () => {
    expect(buildUnmatchedMessage([], ['NSW'])).toBeNull();
  });
});
