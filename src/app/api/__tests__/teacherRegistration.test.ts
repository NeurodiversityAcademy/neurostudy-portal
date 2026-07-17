/**
 * @jest-environment node
 */
import { POST } from '@/app/api/teacherRegistration/route';

jest.mock('@/app/utilities/register/registerCRMContact', () => ({
  registerCRMContact: jest.fn().mockResolvedValue({ ok: true }),
}));

jest.mock('@/app/utilities/register/registerSenderContact', () => ({
  registerSenderContact: jest.fn().mockResolvedValue({ ok: true }),
}));

jest.mock('@/app/utilities/validation/validateTeacherRegistrationData', () => ({
  isValidTeacherRegistrationData: jest.fn(),
}));

import { registerCRMContact } from '@/app/utilities/register/registerCRMContact';
import { registerSenderContact } from '@/app/utilities/register/registerSenderContact';
import { isValidTeacherRegistrationData } from '@/app/utilities/validation/validateTeacherRegistrationData';

const mockIsValid = isValidTeacherRegistrationData as jest.Mock;
const mockRegisterCRM = registerCRMContact as jest.Mock;
const mockRegisterSender = registerSenderContact as jest.Mock;

const validData = {
  email: 'teacher@school.com',
  firstname: 'Jane',
  lastname: 'Smith',
  phone: '0498765432',
};

const makeRequest = (body: unknown): Request =>
  new Request('http://localhost/api/teacherRegistration', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

describe('POST /api/teacherRegistration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 200 with CRM and sender responses on valid data', async () => {
    mockIsValid.mockReturnValue(true);
    mockRegisterCRM.mockResolvedValue({ id: 'crm-1' });
    mockRegisterSender.mockResolvedValue({ id: 'sender-1' });

    const res = await POST(makeRequest(validData));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({ crm: { id: 'crm-1' }, sender: { id: 'sender-1' } });
  });

  it('sets industry to teacher and company to individual on CRM call', async () => {
    mockIsValid.mockReturnValue(true);

    await POST(makeRequest(validData));

    expect(mockRegisterCRM).toHaveBeenCalledWith(
      expect.objectContaining({
        industry: 'teacher',
        company: 'individual',
        hs_persona: 'persona_3',
      }),
    );
  });

  it('calls registerSenderContact with persona_3', async () => {
    mockIsValid.mockReturnValue(true);

    await POST(makeRequest(validData));

    expect(mockRegisterSender).toHaveBeenCalledWith(
      {
        email: validData.email,
        firstname: validData.firstname,
        lastname: validData.lastname,
        phone: validData.phone,
      },
      'persona_3',
    );
  });

  it('returns 400 when data is invalid', async () => {
    mockIsValid.mockReturnValue(false);

    const res = await POST(makeRequest({ email: 'bad' }));

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Bad Request');
  });

  it('returns 400 when a service throws', async () => {
    mockIsValid.mockReturnValue(true);
    mockRegisterCRM.mockRejectedValue(new Error('Service down'));

    const res = await POST(makeRequest(validData));

    expect(res.status).toBe(400);
  });
});
