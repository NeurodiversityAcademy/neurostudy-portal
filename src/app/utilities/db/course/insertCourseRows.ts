import { BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import { COURSE_TABLE_NAME } from '../constants';
import { dbDocumentClient } from '../configure';
import { CourseProps } from '@/app/interfaces/Course';

export default async function insertCourseRows(courses: CourseProps[]) {
  const params = {
    RequestItems: {
      [COURSE_TABLE_NAME]: courses.map((course) => ({
        PutRequest: {
          Item: course,
        },
      })),
    },
  };

  return await dbDocumentClient.send(new BatchWriteCommand(params));
}
