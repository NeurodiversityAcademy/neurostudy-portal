/* eslint-disable @typescript-eslint/no-explicit-any */
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

  // Transform data to match HubSpot expectations
  const properties = {
    ...contact,
    hs_lead_status: 'NEW', // Add required HubSpot property
    lifecyclestage: 'lead', // Add required HubSpot property
  };

  const data = JSON.stringify({ properties });

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
      console.log('HubSpot success response:', response.data);
      const { id, updatedAt, createdAt } = response.data;
      return { id, updatedAt, createdAt } as CRMCreateResponseInterface;
    })
    .catch((error: AxiosError) => {
      const hubspotError = error.response?.data as unknown as any;
      console.error('HubSpot API Error:', {
        status: error.response?.status,
        message: hubspotError?.message,
        validationResults: hubspotError?.validationResults,
        requestData: properties,
      });
      throw error;
    });
};
