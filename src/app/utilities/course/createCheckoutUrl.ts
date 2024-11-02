import axios from 'axios';
import { createRequestConfig } from '../common';
import { CourseCheckoutSession } from '@/app/interfaces/Course';
import queryString from '../queryString';
import { COURSE_TEST_ENROL_KEY } from './constants';

const createCheckoutUrl = async (): Promise<CourseCheckoutSession> => {
  return await axios
    .request(
      createRequestConfig(
        '/course/createCheckoutUrl' +
          queryString.stringify({
            [COURSE_TEST_ENROL_KEY]: queryString.parse()[COURSE_TEST_ENROL_KEY],
          })
      )
    )
    .then((res) => res.data);
};

export default createCheckoutUrl;
