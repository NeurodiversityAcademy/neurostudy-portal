import { SubmitHandler, UseFormReturn } from 'react-hook-form';
import { UserProps } from './User';
import { MouseEventHandler } from 'react';

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
