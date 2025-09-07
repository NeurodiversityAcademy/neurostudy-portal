import { TeacherRegistrationType } from './TeacherRegistrationType';

export type UserFormSubmissionType = TeacherRegistrationType & {
  jobtitle: string;
  message?: string;
  hs_persona:
    | 'student'
    | 'educationProvider'
    | 'educationProfessionals'
    | 'parent'
    | 'ally'
    | 'persona_1'
    | 'other';
};
