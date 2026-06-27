import { providerNameFromId } from '../providerName';

describe('providerNameFromId', () => {
  it('formats provider ids for analytics labels and image alt text', () => {
    expect(providerNameFromId('bond-university')).toBe('Bond University');
    expect(providerNameFromId('acpe')).toBe('Acpe');
    expect(providerNameFromId('flinders-university')).toBe(
      'Flinders University'
    );
  });

  it('ignores empty id segments', () => {
    expect(providerNameFromId('bond--university-')).toBe('Bond University');
  });
});
