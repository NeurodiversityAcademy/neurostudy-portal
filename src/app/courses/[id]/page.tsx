import CourseDetails from '@/app/components/course/CourseDetails';

interface CoursePageProps {
  params: {
    id: string;
  };
}

const CoursePage: React.FC<CoursePageProps> = ({ params }) => {
  const { id } = params;

  return (
    <div className='course-layout'>
      <main className='course-main'>
        <CourseDetails {...{ id }} />
      </main>
    </div>
  );
};

export default CoursePage;
