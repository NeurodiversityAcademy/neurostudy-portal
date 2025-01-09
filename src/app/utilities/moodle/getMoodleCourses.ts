import axios from 'axios';
import { createRequestConfig } from '../common';
import { MoodleCourse } from '@/app/interfaces/Moodle';

const getMoodleCourses = async (): Promise<MoodleCourse[]> => {
  return await axios
    .request(createRequestConfig(`/course/moodle`, null, { method: 'GET' }))
    .then((res) => res.data);
};

export default getMoodleCourses;
