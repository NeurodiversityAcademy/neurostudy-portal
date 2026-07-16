import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import { UserToken } from '@/app/interfaces/User';
import AuthErrorResponse from '@/app/interfaces/AuthErrorResponse';

export default async function isAuthenticated({
  req,
}: {
  req: NextRequest;
}): Promise<UserToken | AuthErrorResponse> {
  const token = (await getToken({
    req,
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  })) as UserToken | null;

  if (!token?.email) {
    return new AuthErrorResponse('User is not authorized.', { status: 401 });
  }

  return {
    id: token.id,
    email: token.email,
    family_name: token.family_name,
    given_name: token.given_name,
  };
}
