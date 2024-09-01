import { UseFormReturn } from 'react-hook-form';
import { UserProps } from './User';

export interface ProfileSectionRef {
  methods: UseFormReturn<UserProps>;
}
