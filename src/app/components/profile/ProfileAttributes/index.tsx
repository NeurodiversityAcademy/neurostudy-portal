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
import { ProfileFieldsType } from '@/app/interfaces/Profile';
import AddIcon from '../../images/Add';

type Props = {
  fields: ProfileFieldsType;
  onSectionEdit?: MouseEventHandler<HTMLButtonElement>;
};

export default function ProfileAttributes({
  fields,
  onSectionEdit,
}: Props): ReactNode {
  const { data: wholeData } = useProfileContext();

  const data: UserProps | undefined = useUpdatedValue<
    UserProps | undefined,
    UserProps | undefined
  >(wholeData, () => {
    return wholeData && getProfileSectionData(wholeData, fields);
  });

  const isDataEmpty = useIsProfileSectionEmpty(data);
  const emptyAttributeInfo =
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
            icon={<AddIcon />}
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
          const value = data[key];
          return <ProfileAttribute key={key} label={label} value={value} />;
        })}
    </div>
  );
}
