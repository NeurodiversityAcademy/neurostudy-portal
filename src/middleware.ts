import { NextRequest, NextResponse } from 'next/server';
import isAuthenticated from '@/app/utilities/auth/isAuthenticated';

export async function middleware(req: NextRequest) {
  const authResponse = await isAuthenticated({ req });

  if (authResponse instanceof Response) {
    const { url } = req;

    const redirectUrl = new URL(
      `/login?error=AuthRequired&callbackUrl=${encodeURIComponent(url)}`,
      url
    );

    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile'],
};
