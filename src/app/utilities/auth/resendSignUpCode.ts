import axios from 'axios';
import { ResendSignUpCodeInput, ResendSignUpCodeOutput } from 'aws-amplify/auth';
import { createRequestConfig } from '../common';

const resendSignUpCode = async (data: ResendSignUpCodeInput): Promise<ResendSignUpCodeOutput> => {
  return await axios
    .request(createRequestConfig('/auth/resendSignUpCode', data))
    .then((res) => res.data);
};

export default resendSignUpCode;
