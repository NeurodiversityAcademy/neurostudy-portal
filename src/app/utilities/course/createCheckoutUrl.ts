import axios from 'axios';
import { createRequestConfig } from '../common';
import { CourseCheckoutSession } from '@/app/interfaces/Course';

const createCheckoutUrl = async (): Promise<CourseCheckoutSession> => {
  return await axios
    .request(createRequestConfig('/course/createCheckoutUrl'))
    .then((res) => res.data);
};

export default createCheckoutUrl;
