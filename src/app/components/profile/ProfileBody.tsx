'use client';

import styles from './profileBody.module.css';
import ProfileBodyHeader from './ProfileBodyHeader';
import ProfileInfoSection from './ProfileInfoSection';
import ProfilePreferenceSection from './ProfilePreferenceSection';
import ProfileChallengeSection from './ProfileChallengeSection';
import ProfileGoalSection from './ProfileGoalSection';
import ProfileStrategySection from './ProfileStrategySection';
import { useState } from 'react';
import { ProfileSectionRef } from '@/app/interfaces/Profile';
import { useProfileContext } from '@/app/utilities/profile/ProfileProvider';
import { useRouter } from 'next/navigation';
import Dialog from '../dialog';
import ProfileFormFooter from './ProfileFormFooter';
import { UserProps } from '@/app/interfaces/User';

const POPUP_SECTION_MAPPER = {
  preference: ProfilePreferenceSection,
  goal: ProfileGoalSection,
  challenge: ProfileChallengeSection,
};

const ProfileBody: React.FC = () => {
  const { saveData, isEditing } = useProfileContext();
  const router = useRouter();

  // NOTE
  // Instead of using `ref.current` and nesting, we will attach attributes
  // directly to the root object
  const [refObj] = useState<Record<string, ProfileSectionRef | null>>({});
  const getRefUpdater = (key: string) => {
    return (ref: ProfileSectionRef | null) => {
      refObj[key] = ref;
    };
  };

  const [popupSection, setPopupSection] =
    useState<keyof typeof POPUP_SECTION_MAPPER>();

  const onCancel = () => {
    // TODO
    // - Use a utility function to form the `href` through object
    // - It should also have the ability to set relative search query
    router.push('?edit=0');
  };

  const onSubmit = async () => {
    const data: Record<string, unknown> = {};

    for (const key in refObj) {
      const ref = refObj[key];
      if (!ref) {
        break;
      }

      const {
        methods: { trigger, getValues },
      } = ref;

      if (!(await trigger(undefined, { shouldFocus: true }))) {
        return;
      }

      Object.assign(data, getValues());
    }

    saveData(data);
  };

  const onClosePopup = () => {
    setPopupSection(undefined);
  };

  const onSectionSubmit = async (data: UserProps) => {
    saveData(data, () => {
      setPopupSection(undefined);
    });
  };

  const PopupComp = popupSection ? POPUP_SECTION_MAPPER[popupSection] : null;

  return (
    <div className={styles.container}>
      <ProfileBodyHeader />
      {isEditing && <ProfileInfoSection ref={getRefUpdater('info')} />}
      <ProfilePreferenceSection
        ref={getRefUpdater('preference')}
        onSectionEdit={() => {
          setPopupSection('preference');
        }}
      />
      <ProfileChallengeSection
        ref={getRefUpdater('challenge')}
        onSectionEdit={() => {
          setPopupSection('challenge');
        }}
      />
      <ProfileGoalSection
        ref={getRefUpdater('goal')}
        onSectionEdit={() => {
          setPopupSection('goal');
        }}
      />
      <ProfileStrategySection ref={getRefUpdater('strategy')} />
      {isEditing && (
        <ProfileFormFooter onCancel={onCancel} onSubmit={onSubmit} />
      )}

      <Dialog open={!!popupSection} onClose={onClosePopup}>
        {PopupComp && (
          <PopupComp popup onSubmit={onSectionSubmit} onCancel={onClosePopup} />
        )}
      </Dialog>
    </div>
  );
};

export default ProfileBody;
