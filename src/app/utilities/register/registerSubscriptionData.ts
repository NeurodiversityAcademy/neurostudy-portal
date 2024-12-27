import axios from 'axios';
import {
  UserSubscriptionHandbookType,
  UserSubscriptionType,
} from '../../interfaces/UserSubscriptionType';
import CRMCreateResponseInterface from '../../interfaces/CRMCreateResponseInterface';
import { downloadContent } from '../common';

export const registerSubscriptionData = async (
  userSubscriptionData: UserSubscriptionType | UserSubscriptionHandbookType
): Promise<CRMCreateResponseInterface> => {
  const data = JSON.stringify(userSubscriptionData);

  const config = {
    method: 'post',
    url: '/api/userSubscription',
    headers: {
      'Content-Type': 'application/json',
    },
    data,
    ...('getHandbook' in userSubscriptionData && {
      responseType: 'blob' as const,
    }),
  };

  return await axios
    .request(config)
    .then((response) => {
      const { data } = response;
      if (data instanceof Blob) {
        downloadContent(data, 'NDA Handbook.pdf');
      }

      return data;
    })
    .catch((error) => {
      console.log(error);
    });
};
