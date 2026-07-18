/**
 * @jest-environment node
 */
import { getIndexName, createDefaultGSI } from '@/app/utilities/db/common';

describe('db/common', () => {
  describe('getIndexName', () => {
    it('prefixes with GSI_', () => {
      expect(getIndexName('Title')).toBe('GSI_Title');
    });

    it('handles empty string', () => {
      expect(getIndexName('')).toBe('GSI_');
    });
  });

  describe('createDefaultGSI', () => {
    it('returns a valid GlobalSecondaryIndex shape', () => {
      const gsi = createDefaultGSI('Email');
      expect(gsi).toEqual({
        IndexName: 'GSI_Email',
        KeySchema: [{ AttributeName: 'Email', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      });
    });

    it('merges partial props over defaults', () => {
      const gsi = createDefaultGSI('Name', {
        ProvisionedThroughput: {
          ReadCapacityUnits: 10,
          WriteCapacityUnits: 10,
        },
      });
      expect(gsi.ProvisionedThroughput?.ReadCapacityUnits).toBe(10);
      expect(gsi.IndexName).toBe('GSI_Name');
    });
  });
});
