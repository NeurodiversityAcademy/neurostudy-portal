import { TeacherRegistrationType } from './TeacherRegistrationType';

export default interface TeacherCRMContactInterface
  extends TeacherRegistrationType {
  industry: 'teacher';
  company: 'individual';
  hs_persona?: string;
}
