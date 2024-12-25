import axios from 'axios';
import {
  UserSubscriptionHandbookType,
  UserSubscriptionType,
} from '../../interfaces/UserSubscriptionType';
import CRMCreateResponseInterface from '../../interfaces/CRMCreateResponseInterface';

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
