import { TeacherRegistrationType } from './TeacherRegistrationType';

export default interface TeacherCRMContactInterface
  extends TeacherRegistrationType {
  industry: 'teacher';
  company: 'individual';
  hs_persona:
    | 'persona_1'
    | 'persona_2'
    | 'persona_3'
    | 'persona_4'
    | 'persona_5';
}
