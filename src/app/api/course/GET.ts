import { consumeRateWithIp } from '@/app/utilities/api/rateLimiter';
import { isObjEmpty } from '@/app/utilities/common';
import { COURSE_TEST_DATA_QUERY_KEY } from '@/app/utilities/course/constants';
import { getIndexName } from '@/app/utilities/db/common';
import { dbDocumentClient } from '@/app/utilities/db/configure';
import {
  COURSE_TABLE_FILTERABLE_NON_INDEX_KEYS,
  COURSE_TABLE_INDEX_KEY_DEFINITIONS,
  COURSE_TABLE_NAME,
  COURSE_TABLE_PARTITION_KEY,
} from '@/app/utilities/db/constants';
import processCourseAPIError from '@/app/utilities/db/processCourseAPIError';
import assertCourseData from '@/app/utilities/validation/assertCourseData';
import {
  ScanCommand,
  QueryCommand,
  QueryCommandInput,
  QueryCommandOutput,
  ScanCommandInput,
  ScanCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import { NextRequest, NextResponse } from 'next/server';

export default async function GET(req: NextRequest): Promise<Response> {
  try {
    await consumeRateWithIp(req);

    const { searchParams } = req.nextUrl;

    if (searchParams.has(COURSE_TEST_DATA_QUERY_KEY)) {
      const res = await fetch(
        'https://nda-test-2.s3.us-west-1.amazonaws.com/temp/good-sample.json.gz'
      );
      const data = await res.json();
      assertCourseData(data);
      return NextResponse.json(data);
    }

    const partitionKeyValue = searchParams.get(COURSE_TABLE_PARTITION_KEY);
    const indexKeyValueObj: Record<string, string> = {};

    COURSE_TABLE_INDEX_KEY_DEFINITIONS.forEach(
      ({ AttributeName, AttributeType }) => {
        AttributeName = AttributeName as string;
        if (AttributeType !== 'S') {
          return;
        }
        const value = searchParams.get(AttributeName);
        if (value) {
          indexKeyValueObj[AttributeName] = value;
        }
      }
    );

    let params: QueryCommandInput | ScanCommandInput;
    const ExpressionAttributeNames: QueryCommandInput['ExpressionAttributeNames'] =
      {};
    const ExpressionAttributeValues: QueryCommandInput['ExpressionAttributeNames'] =
      {};
    const FilterExpressionObj: Record<string, string> = {};

    const updateExpressionAttributes = (key: string, value: string): void => {
      FilterExpressionObj[key] = `#${key} = :${key}`;
      ExpressionAttributeValues[`:${key}`] = value;
      ExpressionAttributeNames[`#${key}`] = key;
    };

    COURSE_TABLE_FILTERABLE_NON_INDEX_KEYS.forEach((key) => {
      const value = searchParams.get(key);
      value && updateExpressionAttributes(key, value);
    });

    for (const indexKey in indexKeyValueObj) {
      updateExpressionAttributes(indexKey, indexKeyValueObj[indexKey]);
    }

    partitionKeyValue &&
      updateExpressionAttributes(COURSE_TABLE_PARTITION_KEY, partitionKeyValue);

    const applyQuery = partitionKeyValue || !isObjEmpty(indexKeyValueObj);

    if (applyQuery) {
      const KeyConditionExpression: string[] = [];
      let IndexName: QueryCommandInput['IndexName'] = undefined;

      if (partitionKeyValue) {
        KeyConditionExpression.push(
          FilterExpressionObj[COURSE_TABLE_PARTITION_KEY]
        );
        delete FilterExpressionObj[COURSE_TABLE_PARTITION_KEY];
      } else {
        for (const indexKey in indexKeyValueObj) {
          IndexName = getIndexName(indexKey);
          KeyConditionExpression.push(FilterExpressionObj[indexKey]);
          delete FilterExpressionObj[indexKey];
          // NOTE
          // Current setup doesn't include SortKey in any of the indexes,
          // if they do, make sure that Key filtering is removed from FilterExpression
          break;
        }
      }

      params = {
        TableName: COURSE_TABLE_NAME,
        IndexName,
        KeyConditionExpression: KeyConditionExpression.join(' AND '),
        ExpressionAttributeValues,
        ExpressionAttributeNames,
      };

      if (!isObjEmpty(FilterExpressionObj)) {
        params.FilterExpression =
          Object.values(FilterExpressionObj).join(' AND ');
      }
    } else {
      params = {
        TableName: COURSE_TABLE_NAME,
        FilterExpression: !isObjEmpty(FilterExpressionObj)
          ? Object.values(FilterExpressionObj).join(' AND ')
          : undefined,
        ExpressionAttributeValues,
        ExpressionAttributeNames,
      };

      if (isObjEmpty(params.ExpressionAttributeValues || {})) {
        delete params.ExpressionAttributeValues;
      }
      if (isObjEmpty(params.ExpressionAttributeNames || {})) {
        delete params.ExpressionAttributeNames;
      }

      if (!params.FilterExpression) {
        params.Limit = 50;
      }
    }

    let data: QueryCommandOutput | ScanCommandOutput;
    if (applyQuery) {
      data = await dbDocumentClient.send(new QueryCommand(params));
    } else {
      data = await dbDocumentClient.send(new ScanCommand(params));
    }

    const Items = data.Items || [];
    assertCourseData(Items);

    return NextResponse.json(Items);
  } catch (ex) {
    return processCourseAPIError(ex);
  }
}
