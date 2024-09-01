import axios from 'axios';
import { createRequestConfig } from '../common';
import { UserProps } from '@/app/interfaces/User';

const saveUserProfile = async (data: UserProps): Promise<void> => {
  return await axios
    .request(
      createRequestConfig('/user', data, {
        method: 'PUT',
      })
    )
    .then((res) => res.data);
};

export default saveUserProfile;
