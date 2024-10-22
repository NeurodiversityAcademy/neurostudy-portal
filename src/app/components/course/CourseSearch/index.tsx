import CourseSecondaryFilter from '../CourseSecondaryFilter';
import styles from './courseSearch.module.css';
import CoursePrimaryFilter from '../CoursePrimaryFilter';
import CourseSearchResult from './CourseSearchResult';

const CourseSearch: React.FC = () => {
  return (
    <main className={styles.container}>
      <CoursePrimaryFilter className={styles.form} />
      <div className={styles.body}>
        <CourseSecondaryFilter />
        <CourseSearchResult />
      </div>
    </main>
  );
};

export default CourseSearch;
