import React from 'react';
import Blog from './Blog';
import blogData from '../../blogs/blogData.json';
import styles from './blog.module.css';
import { BlogInterface } from '@/app/interfaces/BlogInterface';
import { useSearchParams } from 'next/navigation';
import { slugify } from '@/app/utilities/common';
import { useVisitedItems } from '@/app/hooks/useVisitedItems';

const BlogCardList: React.FC = () => {
  const searchParams = useSearchParams();
  const titleSlug = searchParams.get('title');
  const visitedBlogIds = useVisitedItems('blog');

  const blogs: BlogInterface[] = blogData.blogs
    .filter((blog) => slugify(blog.title) !== titleSlug) // Filter out current blog
    .filter((blog) => !visitedBlogIds.includes(blog.id)) // Filter out visited blogs
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
