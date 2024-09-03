import { ReactNode } from 'react';
import styles from './profileAttribute.module.css';
import ProfileAttribute from './ProfileAttribute';
import { UserProps } from '@/app/interfaces/User';
import { PROFILE_LABEL_MAPPER } from '@/app/utilities/profile/constants';

type Props<UserPropKeys extends keyof UserProps = keyof UserProps> = {
  data: UserProps<UserPropKeys>;
};

export default function ProfileAttributes<
  UserPropKeys extends keyof UserProps = keyof UserProps,
>({ data }: Props<UserPropKeys>): ReactNode {
  return (
    <div className={styles.container}>
      {Object.keys(data).map((_key) => {
        const key = _key as keyof typeof data;
        const label = PROFILE_LABEL_MAPPER[key] || '';
        const value = data[key] || '';
        return <ProfileAttribute key={key} label={label} value={value} />;
      })}
    </div>
  );
}
