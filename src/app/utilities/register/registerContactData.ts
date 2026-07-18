import axios from 'axios';
import { UserFormSubmissionType } from '../../interfaces/UserFormSubmissionType';
import CRMCreateResponseInterface from '../../interfaces/CRMCreateResponseInterface';

export const registerContactData = async (
  contactRegistrationData: UserFormSubmissionType,
): Promise<CRMCreateResponseInterface> => {
  const data = JSON.stringify(contactRegistrationData);

  const config = {
    method: 'post',
    url: '/api/contactUsSubmission',
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };

  return await axios
    .request(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};
