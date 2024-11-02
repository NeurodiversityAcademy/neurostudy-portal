'use client';

import { useProfileContext } from '@/app/utilities/profile/ProfileProvider';
import styles from './profileCourses.module.css';
import ProfileCard from './ProfileCard';
import MoodleCourseCard from '../course/CourseCard/MoodleCourseCard';

const ProfileCourses: React.FC = () => {
  const { courses } = useProfileContext();

  if (!courses.length) {
    return null;
  }

  return (
    <ProfileCard title='Courses'>
      You are currently enrolled into the following courses.
      <section className={styles.courseContainer}>
        {courses.map((course) => {
          return <MoodleCourseCard key={course.id} course={course} />;
        })}
      </section>
    </ProfileCard>
  );
};

export default ProfileCourses;
