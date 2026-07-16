import CourseDetails from '@/app/components/course/CourseDetails';

interface CoursePageProps {
  params: Promise<{
    id: string;
  }>;
}

const CoursePage = async ({ params }: CoursePageProps) => {
  const { id } = await params;

  return (
    <div className='course-layout'>
      <main className='course-main'>
        <CourseDetails {...{ id }} />
      </main>
    </div>
  );
};

export default CoursePage;
