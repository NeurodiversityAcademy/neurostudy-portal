/**
 * @jest-environment node
 */
jest.mock('@/app/utilities/db/configure', () => require('@/testUtils/mockDb'));

import { UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { mockSend, resetDbMocks } from '@/testUtils/mockDb';
import { USER_TABLE_NAME, USER_TABLE_PARTITION_ID } from '@/app/utilities/auth/constants';
import updateUser from '../updateUser';

describe('updateUser', () => {
  const mockUserToken = {
    email: 'user@test.com',
    id: 'token-id',
  };

  beforeEach(() => {
    resetDbMocks();
    mockSend.mockResolvedValue({ Attributes: {} });
  });

  it('builds update expression for all item fields and sends UpdateItemCommand', async () => {
    const item = {
      FirstName: 'Updated',
      LastName: 'Name',
      Age: 30,
    };

    const result = await updateUser(item, mockUserToken);

    expect(result).toEqual({ Attributes: {} });
    expect(mockSend).toHaveBeenCalledTimes(1);

    const command = mockSend.mock.calls[0][0] as UpdateItemCommand;
    expect(command).toBeInstanceOf(UpdateItemCommand);
    expect(command.input.TableName).toBe(USER_TABLE_NAME);
    expect(command.input.Key?.[USER_TABLE_PARTITION_ID]).toEqual({
      S: 'user@test.com',
    });
    expect(command.input.UpdateExpression).toBe(
      'set #FirstName = :FirstName, #LastName = :LastName, #Age = :Age',
    );
    expect(command.input.ExpressionAttributeNames).toEqual({
      '#FirstName': 'FirstName',
      '#LastName': 'LastName',
      '#Age': 'Age',
    });
    expect(command.input.ExpressionAttributeValues).toEqual({
      ':FirstName': { S: 'Updated' },
      ':LastName': { S: 'Name' },
      ':Age': { N: '30' },
    });
  });

  it('handles a single attribute update', async () => {
    await updateUser({ Subscribed: true }, mockUserToken);

    const command = mockSend.mock.calls[0][0] as UpdateItemCommand;
    expect(command.input.UpdateExpression).toBe('set #Subscribed = :Subscribed');
    expect(command.input.ExpressionAttributeValues?.[':Subscribed']).toEqual({
      BOOL: true,
    });
  });

  it('uses the authenticated user email as the partition key', async () => {
    await updateUser({ FirstName: 'Test' }, { email: 'other@test.com' });

    const command = mockSend.mock.calls[0][0] as UpdateItemCommand;
    expect(command.input.Key?.[USER_TABLE_PARTITION_ID]).toEqual({
      S: 'other@test.com',
    });
  });

  it('propagates DynamoDB errors', async () => {
    mockSend.mockRejectedValue(new Error('Update failed'));

    await expect(updateUser({ FirstName: 'Fail' }, mockUserToken)).rejects.toThrow('Update failed');
  });
});
