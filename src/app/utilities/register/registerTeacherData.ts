import axios from 'axios';
import { TeacherRegistrationType } from '../../interfaces/TeacherRegistrationType';
import CRMCreateResponseInterface from '../../interfaces/CRMCreateResponseInterface';

export const registerTeacherData = async (
  teacherRegistrationData: TeacherRegistrationType,
): Promise<CRMCreateResponseInterface> => {
  const data = JSON.stringify(teacherRegistrationData);

  const config = {
    method: 'post',
    url: '/api/teacherRegistration',
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };

  return await axios
    .request(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};
