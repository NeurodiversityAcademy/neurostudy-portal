import TeacherCRMContactInterface from '@/app/interfaces/TeacherCRMContactInterface';
import { COMPANY, INDUSTRY } from '@/app/utilities/constants';
import { registerCRMContact } from '@/app/utilities/register/registerCRMContact';
import { registerSenderContact } from '@/app/utilities/register/registerSenderContact';
import { returnBadResponse } from '@/app/utilities/responses';
import { isValidTeacherRegistrationData } from '@/app/utilities/validation/validateTeacherRegistrationData';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!isValidTeacherRegistrationData(data)) {
      return returnBadResponse();
    }

    const { email, firstname, lastname, phone } = data;

    const teacherCRMContact: TeacherCRMContactInterface = {
      ...data,
      industry: INDUSTRY.TEACHER,
      company: COMPANY.INDIVIDUAL,
      hs_persona: 'persona_3',
    };

    const [crmResponse, senderResponse] = await Promise.all([
      registerCRMContact(teacherCRMContact),
      registerSenderContact({ email, firstname, lastname, phone }, 'persona_3'),
    ]);

    return new Response(
      JSON.stringify({ crm: crmResponse, sender: senderResponse }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return returnBadResponse();
  }
}
