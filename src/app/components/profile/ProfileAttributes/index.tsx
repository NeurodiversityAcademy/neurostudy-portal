import { MouseEventHandler, ReactNode } from 'react';
import styles from './profileAttribute.module.css';
import ProfileAttribute from './ProfileAttribute';
import { UserProps } from '@/app/interfaces/User';
import {
  PROFILE_EMPTY_ATTRIBUTE_MAP,
  PROFILE_LABEL_MAPPER,
} from '@/app/utilities/profile/constants';
import useUpdatedValue from '@/app/hooks/useUpdatedValue';
import getProfileSectionData from '@/app/utilities/profile/getProfileSectionData';
import { useProfileContext } from '@/app/utilities/profile/ProfileProvider';
import ActionButton from '../../buttons/ActionButton';
import { BUTTON_STYLE } from '@/app/utilities/constants';
import useIsProfileSectionEmpty from '@/app/hooks/useIsProfileSectionEmpty';

type Props<UserPropKeys extends keyof UserProps = keyof UserProps> = {
  fields: readonly UserPropKeys[];
  onSectionEdit?: MouseEventHandler<HTMLButtonElement>;
};

export default function ProfileAttributes<
  UserPropKeys extends keyof UserProps = keyof UserProps,
>({ fields, onSectionEdit }: Props<UserPropKeys>): ReactNode {
  const { data: wholeData } = useProfileContext();

  const data: UserProps<UserPropKeys> | undefined = useUpdatedValue<
    UserProps<UserPropKeys> | undefined,
    UserProps | undefined
  >(wholeData, () => {
    return wholeData && getProfileSectionData<UserPropKeys>(wholeData, fields);
  });

  const isDataEmpty = useIsProfileSectionEmpty<UserPropKeys>(data);
  const emptyAttributeInfo =
    /* @ts-expect-error: Either the key maps to a value or returns undefined */
    (isDataEmpty && PROFILE_EMPTY_ATTRIBUTE_MAP.get(fields)) || undefined;

  if (!data) {
    return null;
  }

  const EmptyAttributeElement =
    isDataEmpty &&
    emptyAttributeInfo &&
    (() => {
      const { label, value, btnText } = emptyAttributeInfo;

      return (
        <>
          <ProfileAttribute label={label} value={value} />
          <ActionButton
            label={btnText}
            style={BUTTON_STYLE.Secondary}
            className={styles.addBtn}
            onClick={onSectionEdit}
          />
        </>
      );
    })();

  return (
    <div className={styles.container}>
      {EmptyAttributeElement ||
        Object.keys(data).map((_key) => {
          const key = _key as keyof typeof data;
          const label = PROFILE_LABEL_MAPPER[key] || '';
          const value = data[key] || '';
          return <ProfileAttribute key={key} label={label} value={value} />;
        })}
    </div>
  );
}
