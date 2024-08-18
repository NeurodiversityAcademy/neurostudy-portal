import { PutCommand, PutCommandInput } from '@aws-sdk/lib-dynamodb';
import { CourseDetailsProps } from '@/app/interfaces/Course';
import { COURSE_DETAILS_TABLE_NAME } from '../constants';
import { dbDocumentClient } from '../configure';

export default async function insertCourseDetails(
  courseDetails: CourseDetailsProps
): Promise<void> {
  const commandParams: PutCommandInput = {
    TableName: COURSE_DETAILS_TABLE_NAME,
    Item: courseDetails,
  };

  const command = new PutCommand(commandParams);
  await dbDocumentClient.send(command);
}
