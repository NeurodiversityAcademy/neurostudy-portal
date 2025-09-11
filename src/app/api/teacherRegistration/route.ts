import TeacherCRMContactInterface from '@/app/interfaces/TeacherCRMContactInterface';
import { COMPANY, INDUSTRY } from '@/app/utilities/constants';
import { registerCRMContact } from '@/app/utilities/register/registerCRMContact';
import { returnBadResponse } from '@/app/utilities/responses';
import { isValidTeacherRegistrationData } from '@/app/utilities/validation/validateTeacherRegistrationData';

export async function POST(request: Request) {
  const data = await request.json();
  if (isValidTeacherRegistrationData(data)) {
    const teacherCRMContact: TeacherCRMContactInterface = {
      ...data,
      industry: INDUSTRY.TEACHER,
      company: COMPANY.INDIVIDUAL,
      hs_persona: 'persona_3',
    };
    const response = await registerCRMContact(teacherCRMContact);
    return new Response(JSON.stringify(response));
  }
  return returnBadResponse();
}
