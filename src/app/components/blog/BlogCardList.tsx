import React from 'react';
import Blog from './Blog';
import blogData from '../../blogs/blogData.json';
import styles from './blog.module.css';
import { BlogInterface } from '@/app/interfaces/BlogInterface';
import { useSearchParams } from 'next/navigation';
import { slugify } from '@/app/utilities/common';

const BlogCardList: React.FC = () => {
  const searchParams = useSearchParams();
  const titleSlug = searchParams.get('title');
  //const blogId = searchParams.get('blogId');

  //filter out the blog if user already inside that blog
  const blogs: BlogInterface[] = blogData.blogs
    .filter((blog) => slugify(blog.title) != titleSlug)
    .reverse()
    .slice(0, 3);

  // const blogs: BlogInterface[] = blogData.blogs
  //   .filter((blog) => blog.id != blogId)
  //   .reverse()
  //   .slice(0, 3);

  return (
    <div className={styles.cardList}>
      {blogs.map((blog: BlogInterface) => (
        <Blog key={blog.id} {...blog} />
      ))}
    </div>
  );
};

export default BlogCardList;
