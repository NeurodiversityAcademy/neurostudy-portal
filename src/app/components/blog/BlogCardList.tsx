import React from 'react';
import Blog from './Blog';
import blogData from '../../blogs/blogData.json';
import styles from './blog.module.css';
import { BlogInterface } from '@/app/interfaces/BlogInterface';
import { useSearchParams } from 'next/navigation';

const BlogCardList: React.FC = () => {
  const searchParams = useSearchParams();
  const blogId = searchParams.get('blogId');

  //filter out the blog if user already inside that blog
  const blogs: BlogInterface[] = blogData.blogs
    .filter((blog) => blog.id != blogId)
    .reverse()
    .slice(0, 3);

  return (
    <div className={styles.cardList}>
      {blogs.map((blog: BlogInterface) => (
        <Blog key={blog.id} {...blog} />
      ))}
    </div>
  );
};

export default BlogCardList;
