import axios from 'axios';
import { SignUpInput, SignUpOutput } from 'aws-amplify/auth';
import { createRequestConfig } from '../common';

const signUp = async (data: SignUpInput): Promise<SignUpOutput> => {
  return await axios
    .request(createRequestConfig('/auth/signUp', data))
    .then((res) => res.data);
};

export default signUp;
