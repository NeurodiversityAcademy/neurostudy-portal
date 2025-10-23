import { AxiosResponse, AxiosError } from 'axios';
import TeacherCRMContactInterface from '../../interfaces/TeacherCRMContactInterface';
import CRMCreateResponseInterface from '../../interfaces/CRMCreateResponseInterface';
import axios from 'axios';
import { UserFormSubmissionType } from '../../interfaces/UserFormSubmissionType';
import { UserSubscriptionType } from '../../interfaces/UserSubscriptionType';

export const registerCRMContact = async (
  contact:
    | TeacherCRMContactInterface
    | UserFormSubmissionType
    | UserSubscriptionType
): Promise<CRMCreateResponseInterface | boolean> => {
  console.log('Sending to HubSpot:', contact);
  
  const data = JSON.stringify({
    properties: {
      ...contact,
    },
  });

  const config = {
    method: 'post',
    url: `${process.env.CRM_BASE_URL}/objects/contacts`,
    headers: {
      authorization: `Bearer ${process.env.CRM_ACCESS_KEY}`,
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
    .catch((error: AxiosError) => {
      console.error('HubSpot API Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        error: error.message,
        fullError: JSON.stringify(error.response?.data, null, 2)
      });
      throw error; // Propagate error to see it in the frontend
    });
};
