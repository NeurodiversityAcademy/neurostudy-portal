import CourseDetails from '@/app/components/course/CourseDetails';
import '@/styles/course-sidebar.css';

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

      <aside className='course-sidebar'>
        {/* Sidebar content (anchors, quick links, FAQ etc.) */}
      </aside>
    </div>
  );
};

export default CoursePage;
