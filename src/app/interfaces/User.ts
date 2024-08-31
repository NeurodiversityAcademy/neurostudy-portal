import { JWT } from 'next-auth/jwt';
import {
  DEFAULT_USER,
  USER_TABLE_PARTITION_ID,
} from '../utilities/auth/constants';

export type UserProps = Partial<typeof DEFAULT_USER>;
export type UserWithEmailProps = Partial<typeof DEFAULT_USER> & {
  [USER_TABLE_PARTITION_ID]: string;
};

export type UserToken = Partial<Omit<JWT, 'email'>> & {
  email: string;
};
