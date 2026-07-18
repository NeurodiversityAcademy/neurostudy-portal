/**
 * Shared mock for @/app/utilities/db/configure
 * Usage: jest.mock('@/app/utilities/db/configure', () => require('@/testUtils/mockDb'));
 */

export const mockSend = jest.fn();

export const dbDocumentClient = { send: mockSend };
export const dbClient = { send: mockSend };

export function resetDbMocks(): void {
  mockSend.mockReset();
}
