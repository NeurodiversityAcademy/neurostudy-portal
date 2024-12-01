import { UserProps, UserToken } from '@/app/interfaces/User';
import isAuthenticated from '@/app/utilities/auth/isAuthenticated';
import assertUserProps from '@/app/utilities/validation/assertUserData';
import { UpdateItemCommandOutput } from '@aws-sdk/client-dynamodb';
import { NextRequest } from 'next/server';
import updateUser from '@/app/utilities/auth/updateUser';
import createUser from '@/app/utilities/auth/createUser';
import { returnAuthError } from '@/app/utilities/auth/responses';
import getUser from '@/app/utilities/auth/getUser';

export async function GET(req: NextRequest) {
  try {
    const userResponse: UserToken | Response = await isAuthenticated({ req });

    if (userResponse instanceof Response) {
      return userResponse;
    }

    const { email, family_name = '', given_name = '' } = userResponse;
    let user = await getUser(email);

    if (!user) {
      // NOTE
      // This is possible when idP user signs up
      user = await createUser({ email, family_name, given_name });
    }

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    });
  } catch (ex) {
    return returnAuthError(ex);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userResponse: UserToken | Response = await isAuthenticated({ req });

    if (userResponse instanceof Response) {
      return userResponse;
    }

    const user = userResponse as UserToken;

    const Item: UserProps = await req.json();
    assertUserProps(Item);

    const updateResponse: UpdateItemCommandOutput = await updateUser(
      Item,
      user
    );

    if (updateResponse instanceof Response) {
      return updateResponse;
    }

    return new Response(null, {
      status: 200,
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    });
  } catch (ex) {
    return returnAuthError(ex);
  }
}
