import APIError from '@/app/interfaces/APIError';
import { UserToken } from '@/app/interfaces/User';
import isAuthenticated from '@/app/utilities/auth/isAuthenticated';
import { dbDocumentClient } from '@/app/utilities/db/configure';
import { COURSE_TABLE_NAME } from '@/app/utilities/db/constants';
import processCourseAPIError from '@/app/utilities/db/processCourseAPIError';
import assertCourseData from '@/app/utilities/validation/assertCourseData';
import {
  QueryCommand,
  QueryCommandInput,
  QueryCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import { NextRequest, NextResponse } from 'next/server';

export default async function GET(req: NextRequest): Promise<Response> {
  try {
    const userResponse: UserToken | Response = await isAuthenticated({ req });

    if (userResponse instanceof Response) {
      return userResponse;
    }

    const { searchParams } = req.nextUrl;
    const institutionName = searchParams.get('institutionName');
    const title = searchParams.get('title');
    const level = searchParams.get('level');
    const interestArea = searchParams.get('interestArea');
    const limit = parseInt(searchParams.get('limit') || '0') || 15;

    const params: QueryCommandInput = {
      TableName: COURSE_TABLE_NAME,
      IndexName: undefined,
      KeyConditionExpression: undefined,
      Limit: Number(limit),
    };

    const ExpressionAttributeValues: QueryCommandInput['ExpressionAttributeNames'] =
      {};

    if (institutionName) {
      params.KeyConditionExpression = 'InstitutionName = :institutionName';
      ExpressionAttributeValues[':institutionName'] = institutionName;
    } else if (title) {
      params.IndexName = 'GSI_Title';
      params.KeyConditionExpression = 'Title = :title';
      ExpressionAttributeValues[':title'] = title;
    } else if (level) {
      params.IndexName = 'GSI_Level';
      params.KeyConditionExpression = 'Level = :level';
      ExpressionAttributeValues[':level'] = level;
    } else if (interestArea) {
      params.IndexName = 'GSI_InterestArea';
      params.KeyConditionExpression = 'InterestArea = :interestArea';
      ExpressionAttributeValues[':interestArea'] = interestArea;
    } else {
      throw new APIError({ error: 'Invalid query parameters' });
    }

    params.ExpressionAttributeValues = ExpressionAttributeValues;

    const data: QueryCommandOutput = await dbDocumentClient.send(
      new QueryCommand(params)
    );
    const Items = data.Items || [];
    assertCourseData(Items);

    return NextResponse.json(Items);
  } catch (ex) {
    return processCourseAPIError(ex);
  }
}
