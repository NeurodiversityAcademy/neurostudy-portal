/**
 * @jest-environment node
 */
import { POST } from '@/app/api/contactUsSubmission/route';

jest.mock('@/app/utilities/register/registerCRMContact', () => ({
  registerCRMContact: jest.fn().mockResolvedValue({ ok: true }),
}));

jest.mock('@/app/utilities/register/registerSenderContact', () => ({
  registerSenderContact: jest.fn().mockResolvedValue({ ok: true }),
}));

jest.mock(
  '@/app/utilities/validation/validateContactUsFormData',
  () => ({
    isValidContactUsFormData: jest.fn(),
  })
);

import { registerCRMContact } from '@/app/utilities/register/registerCRMContact';
import { registerSenderContact } from '@/app/utilities/register/registerSenderContact';
import { isValidContactUsFormData } from '@/app/utilities/validation/validateContactUsFormData';

const mockIsValid = isValidContactUsFormData as jest.Mock;
const mockRegisterCRM = registerCRMContact as jest.Mock;
const mockRegisterSender = registerSenderContact as jest.Mock;

const validData = {
  email: 'test@example.com',
  firstname: 'John',
  lastname: 'Doe',
  phone: '0412345678',
  hs_persona: 'persona_1',
  message: 'Hello',
};

const makeRequest = (body: unknown): Request =>
  new Request('http://localhost/api/contactUsSubmission', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

describe('POST /api/contactUsSubmission', () => {
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
    expect(mockRegisterCRM).toHaveBeenCalledWith(validData);
    expect(mockRegisterSender).toHaveBeenCalledWith(
      {
        email: validData.email,
        firstname: validData.firstname,
        lastname: validData.lastname,
        phone: validData.phone,
      },
      'persona_1'
    );
  });

  it('returns 400 when form data is invalid', async () => {
    mockIsValid.mockReturnValue(false);

    const res = await POST(makeRequest({ email: 'bad' }));

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Bad Request');
  });

  it('defaults hs_persona to persona_1 when not provided', async () => {
    mockIsValid.mockReturnValue(true);
    const dataWithoutPersona = { ...validData, hs_persona: undefined };

    await POST(makeRequest(dataWithoutPersona));

    expect(mockRegisterSender).toHaveBeenCalledWith(
      expect.any(Object),
      'persona_1'
    );
  });

  it('returns 400 when registerCRMContact throws', async () => {
    mockIsValid.mockReturnValue(true);
    mockRegisterCRM.mockRejectedValue(new Error('CRM failure'));

    const res = await POST(makeRequest(validData));

    expect(res.status).toBe(400);
  });

  it('returns 400 when registerSenderContact throws', async () => {
    mockIsValid.mockReturnValue(true);
    mockRegisterSender.mockRejectedValue(new Error('Sender failure'));

    const res = await POST(makeRequest(validData));

    expect(res.status).toBe(400);
  });
});
