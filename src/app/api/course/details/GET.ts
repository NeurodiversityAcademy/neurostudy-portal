'use client';

import APIError from '@/app/interfaces/APIError';
import { consumeRateWithIp } from '@/app/utilities/api/rateLimiter';
import { dbDocumentClient } from '@/app/utilities/db/configure';
import {
  COURSE_DETAILS_TABLE_NAME,
  COURSE_DETAILS_TABLE_PARTITION_KEY,
} from '@/app/utilities/db/constants';
import processCourseAPIError from '@/app/utilities/db/processCourseAPIError';
import assertCourseDetails from '@/app/utilities/validation/assertCourseDetailsData';
import {
  GetItemCommand,
  GetItemCommandInput,
  GetItemCommandOutput,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export default async function GET(req: NextRequest): Promise<Response> {
  try {
    await consumeRateWithIp(req);

    const { searchParams } = req.nextUrl;

    const CourseId = searchParams.get('id');

    if (!CourseId) {
      throw new APIError({ error: 'Please provide an id.' });
    }

    const commandParams: GetItemCommandInput = {
      TableName: COURSE_DETAILS_TABLE_NAME,
      Key: marshall({
        [COURSE_DETAILS_TABLE_PARTITION_KEY]: CourseId,
      }),
    };

    const command = new GetItemCommand(commandParams);
    const res: GetItemCommandOutput = await dbDocumentClient.send(command);

    const { Item } = res;
    if (!Item) {
      throw new APIError({ error: 'Invalid id provided.' });
    }

    const data = unmarshall(Item);
    assertCourseDetails(data);

    return NextResponse.json(data);
  } catch (ex) {
    return processCourseAPIError(ex);
  }
}
