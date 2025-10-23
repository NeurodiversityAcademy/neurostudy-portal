/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserFormSubmissionType } from '@/app/interfaces/UserFormSubmissionType';
import { registerCRMContact } from '@/app/utilities/register/registerCRMContact';
import { isValidContactUsFormData } from '@/app/utilities/validation/validateContactUsFormData';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Incoming contact form data:', data);

    const isValid = isValidContactUsFormData(data);
    console.log('Validation result:', isValid);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
    }

    const userContactForm: UserFormSubmissionType = {
      ...data,
    };

    try {
      const response = await registerCRMContact(userContactForm);
      if (!response) {
        return NextResponse.json(
          { error: 'Failed to create contact in HubSpot' },
          { status: 400 }
        );
      }
      return NextResponse.json(response);
    } catch (error: any) {
      console.error('HubSpot error:', error!.response!.data);
      return NextResponse.json(
        { error: error.response?.data || 'HubSpot API error' },
        { status: error.response?.status || 500 }
      );
    }
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
