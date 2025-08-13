import React from 'react';
import Blog from './Blog';
import blogData from '../../blogs/blogData.json';
import styles from './blog.module.css';
import { BlogInterface } from '@/app/interfaces/BlogInterface';
import { slugify } from '@/app/utilities/common';
import { ReadonlyURLSearchParams } from 'next/navigation';

interface BlogCardListProps {
  searchParams: ReadonlyURLSearchParams;
  visitedBlogIds: (number | string)[];
}

const BlogCardList = ({ searchParams, visitedBlogIds }: BlogCardListProps) => {
  const titleSlug = searchParams.get('title');

  const blogs: BlogInterface[] = blogData.blogs
    .filter((blog) => slugify(blog.title) !== titleSlug) // Filter out current blog
    .filter((blog) => !visitedBlogIds.includes(blog.id)) // Filter out visited blogs
    .reverse()
    .slice(0, 3);

  if (blogs.length < 3) {
    const needed = 3 - blogs.length;
    const blogIdsToShow = blogs.map((blog) => blog.id);

    const fallbackBlogs = blogData.blogs
      .filter((blog) => slugify(blog.title) !== titleSlug) // Exclude current
      .filter((blog) => !blogIdsToShow.includes(blog.id)) // Exclude already selected
      .sort(() => 0.5 - Math.random()) // Shuffle to get random blogs
      .slice(0, needed);

    blogs.push(...fallbackBlogs);
  }

  return (
    <div className={styles.cardList}>
      {blogs.map((blog: BlogInterface) => (
        <Blog key={blog.id} {...blog} />
      ))}
    </div>
  );
};

export default BlogCardList;
