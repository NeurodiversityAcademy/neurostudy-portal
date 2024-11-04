import axios from 'axios';
import { createRequestConfig } from '../common';
import { MoodleCourse } from '@/app/interfaces/Moodle';
import queryString from '../queryString';
import { COURSE_TEST_ENROL_KEY } from '../course/constants';

const getMoodleCourses = async (): Promise<MoodleCourse[]> => {
  return await axios
    .request(
      createRequestConfig(
        `/course/moodle${queryString.stringify({
          [COURSE_TEST_ENROL_KEY]: queryString.parse()[COURSE_TEST_ENROL_KEY],
        })}`,
        null,
        { method: 'GET' }
      )
    )
    .then((res) => res.data);
};

export default getMoodleCourses;
