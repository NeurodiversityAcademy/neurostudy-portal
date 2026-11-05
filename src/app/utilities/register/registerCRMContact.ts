import { AxiosResponse } from 'axios';
import TeacherCRMContactInterface from '../../interfaces/TeacherCRMContactInterface';
import CRMCreateResponseInterface from '../../interfaces/CRMCreateResponseInterface';
import axios from 'axios';
import { UserFormSubmissionType } from '../../interfaces/UserFormSubmissionType';
import { UserSubscriptionType } from '../../interfaces/UserSubscriptionType';
import { ShortlistCRMContact } from '../../interfaces/ShortlistCRMContact';

export const registerCRMContact = async (
  contact:
    | TeacherCRMContactInterface
    | UserFormSubmissionType
    | UserSubscriptionType
    | ShortlistCRMContact,
): Promise<CRMCreateResponseInterface | boolean> => {
  const crmBaseUrl = process.env.CRM_BASE_URL;
  const crmAccessKey = process.env.CRM_ACCESS_KEY;

  if (!crmBaseUrl || !crmAccessKey) {
    console.warn('CRM contact registration skipped: missing CRM configuration');
    return false;
  }

  const data = JSON.stringify({
    properties: {
      ...contact,
    },
  });

  const config = {
    method: 'post',
    url: `${crmBaseUrl.replace(/\/+$/, '')}/objects/contacts`,
    headers: {
      authorization: `Bearer ${crmAccessKey}`,
      'content-type': 'application/json',
    },
    data: data,
  };

  return await axios
    .request(config)
    .then((response: AxiosResponse) => {
      const { id, updatedAt, createdAt } = response.data;
      return { id, updatedAt, createdAt } as CRMCreateResponseInterface;
    })
    .catch((error: Error) => {
      // Never log the Axios error object: its config carries the contact payload (email).
      console.log('CRM contact request failed', { message: error.message });
      return false;
    });
};
