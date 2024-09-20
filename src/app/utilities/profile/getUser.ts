import axios from 'axios';
import { createRequestConfig } from '../common';
import { UserWithEmailProps } from '@/app/interfaces/User';

const getUserProfile = async (): Promise<UserWithEmailProps> => {
  return await axios
    .request(createRequestConfig('/user', null, { method: 'GET' }))
    .then((res) => res.data);
};

export default getUserProfile;
