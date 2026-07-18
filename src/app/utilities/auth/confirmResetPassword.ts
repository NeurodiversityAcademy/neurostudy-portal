import axios from 'axios';
import { ConfirmResetPasswordInput } from 'aws-amplify/auth';
import { createRequestConfig } from '../common';

const confirmResetPassword = async (data: ConfirmResetPasswordInput): Promise<void> => {
  return await axios
    .request(createRequestConfig('/auth/confirmResetPassword', data))
    .then((res) => res.data);
};

export default confirmResetPassword;
