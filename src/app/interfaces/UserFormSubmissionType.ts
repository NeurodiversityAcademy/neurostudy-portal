import { TeacherRegistrationType } from './TeacherRegistrationType';

export type UserFormSubmissionType = TeacherRegistrationType & {
  jobtitle: string;
  message?: string;
  persona:
    | 'student'
    | 'educationProvider'
    | 'educationProfessionals'
    | 'parent'
    | 'ally'
    | 'other';
};
