import { DescribeTableCommand } from '@aws-sdk/client-dynamodb';
import { dbDocumentClient } from '../configure';
import { COURSE_TABLE_NAME } from '../constants';

export default async function describeCourseTable() {
  return await dbDocumentClient.send(
    new DescribeTableCommand({ TableName: COURSE_TABLE_NAME })
  );
}
