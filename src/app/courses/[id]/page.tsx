import CourseDetails from '@/app/components/course/CourseDetails';

interface CoursePageProps {
  params: {
    id: string;
  };
}

const CoursePage: React.FC<CoursePageProps> = async props => {
  const params = await props.params;
  const { id } = params;

  return <CourseDetails {...{ id }} />;
};

export default CoursePage;
