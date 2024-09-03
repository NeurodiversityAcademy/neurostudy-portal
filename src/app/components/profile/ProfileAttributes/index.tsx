import { ReactNode } from 'react';
import styles from './profileAttribute.module.css';
import ProfileAttribute from './ProfileAttribute';
import { UserProps } from '@/app/interfaces/User';
import { PROFILE_LABEL_MAPPER } from '@/app/utilities/profile/constants';
import useUpdatedValue from '@/app/hooks/useUpdatedValue';
import getProfileSectionData from '@/app/utilities/profile/getProfileSectionData';
import { useProfileContext } from '@/app/utilities/profile/ProfileProvider';

type Props<UserPropKeys extends keyof UserProps = keyof UserProps> = {
  fields: readonly UserPropKeys[];
};

export default function ProfileAttributes<
  UserPropKeys extends keyof UserProps = keyof UserProps,
>({ fields }: Props<UserPropKeys>): ReactNode {
  const { data: wholeData } = useProfileContext();

  const data: UserProps<UserPropKeys> | undefined = useUpdatedValue<
    UserProps<UserPropKeys> | undefined,
    UserProps | undefined
  >(wholeData, () => {
    return wholeData && getProfileSectionData<UserPropKeys>(wholeData, fields);
  });

  if (!data) {
    return null
  }

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
