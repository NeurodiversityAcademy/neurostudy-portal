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
      throw error;
    });
};
