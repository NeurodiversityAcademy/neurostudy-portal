import { shuffleInstitutions } from '../shuffleInstitutions';

describe('shuffleInstitutions', () => {
  it('returns a new array with the same members', () => {
    const input = ['a', 'b', 'c', 'd', 'e'];
    const result = shuffleInstitutions(input);

    expect(result).not.toBe(input);
    expect(result).toHaveLength(input.length);
    expect([...result].sort()).toEqual([...input].sort());
  });

  it('does not mutate the input array', () => {
    const input = ['a', 'b', 'c'];
    const snapshot = [...input];
    shuffleInstitutions(input);
    expect(input).toEqual(snapshot);
  });
});
