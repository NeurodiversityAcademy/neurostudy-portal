import { consumeRateWithIp } from '@/app/utilities/api/rateLimiter';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const data = await consumeRateWithIp(req);

    return NextResponse.json({ status: 200, data });
  } catch (error) {
    const status = 400;

    return NextResponse.json({ status, error }, { status });
  }
}
