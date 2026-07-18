import { NextRequest, NextResponse } from 'next/server';
import isAuthenticated from '@/app/utilities/auth/isAuthenticated';

export async function proxy(req: NextRequest) {
  const authResponse = await isAuthenticated({ req });

  if (authResponse instanceof Response) {
    const requestUrl = new URL(req.url);
    const callbackPath = `${requestUrl.pathname}${requestUrl.search}`;

    const redirectUrl = new URL(
      `/login?error=AuthRequired&callbackUrl=${encodeURIComponent(callbackPath)}`,
      requestUrl,
    );

    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile'],
};
