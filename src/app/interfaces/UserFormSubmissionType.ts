import { TeacherRegistrationType } from './TeacherRegistrationType';

export type UserFormSubmissionType = TeacherRegistrationType & {
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
