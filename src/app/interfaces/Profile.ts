import { SubmitHandler, UseFormReturn } from 'react-hook-form';
import { UserProps } from './User';
import { MouseEventHandler } from 'react';
import {
  CHALLENGE_FIELDS,
  GOAL_FIELDS,
  PREFERENCE_FIELDS,
  STRATEGY_FIELDS,
} from '../utilities/profile/constants';

export interface ProfileSectionRef {
  methods: UseFormReturn<UserProps>;
}

type BaseProfileSectionProps = {
  onSectionEdit?: MouseEventHandler<HTMLButtonElement>;
  popup?: boolean;
};

type ProfileSectionPopupTrueProps = BaseProfileSectionProps & {
  popup: true;
  onSubmit: SubmitHandler<UserProps>;
  onCancel?: MouseEventHandler<HTMLButtonElement>;
};

type ProfileSectionPopupFalseProps = BaseProfileSectionProps & {
  popup?: false;
  onSubmit?: never;
  onCancel?: never;
};

export type ProfileSectionProps =
  | ProfileSectionPopupTrueProps
  | ProfileSectionPopupFalseProps;

export interface ProfileSectionFormProps {
  onSubmit?: SubmitHandler<UserProps>;
  onCancel?: MouseEventHandler<HTMLButtonElement>;
}

export type ProfileFieldsType =
  | typeof PREFERENCE_FIELDS
  | typeof GOAL_FIELDS
  | typeof CHALLENGE_FIELDS
  | typeof STRATEGY_FIELDS;
