/**
 * @jest-environment node
 */
jest.mock('@/app/utilities/db/configure', () => require('@/testUtils/mockDb'));

import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import { mockSend, resetDbMocks } from '@/testUtils/mockDb';
import {
  USER_TABLE_NAME,
  USER_TABLE_PARTITION_ID,
} from '@/app/utilities/auth/constants';
import createUser from '../createUser';

describe('createUser', () => {
  beforeEach(() => {
    resetDbMocks();
    mockSend.mockResolvedValue({});
  });

  it('creates a user with primary attributes and sends PutItemCommand', async () => {
    const user = await createUser({
      email: 'newuser@test.com',
      family_name: 'Smith',
      given_name: 'Alex',
    });

    expect(user.Email).toBe('newuser@test.com');
    expect(user.FirstName).toBe('Alex');
    expect(user.LastName).toBe('Smith');
    expect(user.Age).toBeUndefined();
    expect(user.Subscribed).toBeUndefined();
    expect(user.FocusAids).toBeUndefined();

    expect(mockSend).toHaveBeenCalledTimes(1);
    const command = mockSend.mock.calls[0][0];
    expect(command).toBeInstanceOf(PutItemCommand);
    expect(command.input.TableName).toBe(USER_TABLE_NAME);
    expect(command.input.Item?.[USER_TABLE_PARTITION_ID]).toEqual({
      S: 'newuser@test.com',
    });
  });

  it('includes optional secondary attributes when provided', async () => {
    const user = await createUser(
      {
        email: 'subscriber@test.com',
        family_name: 'Lee',
        given_name: 'Sam',
      },
      {
        birthdate: '1990-05-15',
        subscribed: true,
      }
    );

    expect(user.DOB).toBe('1990-05-15');
    expect(user.Subscribed).toBe(true);

    const command = mockSend.mock.calls[0][0] as PutItemCommand;
    expect(command.input.Item?.DOB).toEqual({ S: '1990-05-15' });
    expect(command.input.Item?.Subscribed).toEqual({ BOOL: true });
  });

  it('omits undefined optional fields from the stored item', async () => {
    const user = await createUser({
      email: 'minimal@test.com',
      family_name: 'Minimal',
      given_name: 'User',
    });

    expect(user.DOB).toBeUndefined();

    const command = mockSend.mock.calls[0][0] as PutItemCommand;
    expect(command.input.Item?.DOB).toBeUndefined();
  });

  it('clears default array fields before persisting', async () => {
    const user = await createUser({
      email: 'arrays@test.com',
      family_name: 'Arr',
      given_name: 'Ray',
    });

    expect(user.Conditions).toEqual([]);
    expect(user.Institutions).toEqual([]);

    const command = mockSend.mock.calls[0][0] as PutItemCommand;
    expect(command.input.Item?.Conditions).toEqual({ L: [] });
  });

  it('propagates DynamoDB errors', async () => {
    mockSend.mockRejectedValue(new Error('DynamoDB failure'));

    await expect(
      createUser({
        email: 'fail@test.com',
        family_name: 'Fail',
        given_name: 'User',
      })
    ).rejects.toThrow('DynamoDB failure');
  });
});
