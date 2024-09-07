import { DescribeTableCommand } from '@aws-sdk/client-dynamodb';
import { dbDocumentClient } from '../configure';
import { COURSE_DETAILS_TABLE_NAME } from '../constants';

export default async function describeCourseDetailsTable() {
  return await dbDocumentClient.send(
    new DescribeTableCommand({ TableName: COURSE_DETAILS_TABLE_NAME })
  );
}
