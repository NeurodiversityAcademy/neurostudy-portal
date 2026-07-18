import axios from 'axios';
import { ResetPasswordInput, ResetPasswordOutput } from 'aws-amplify/auth';
import { createRequestConfig } from '../common';

const resetPassword = async (data: ResetPasswordInput): Promise<ResetPasswordOutput> => {
  return await axios
    .request(createRequestConfig('/auth/resetPassword', data))
    .then((res) => res.data);
};

export default resetPassword;
