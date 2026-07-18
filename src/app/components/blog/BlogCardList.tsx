import React from 'react';
import Blog from './Blog';
import blogData from '../../blogs/blogData.json';
import styles from './blog.module.css';
import { BlogInterface } from '@/app/interfaces/BlogInterface';
import { pickSeeded, slugify } from '@/app/utilities/common';
import { ReadonlyURLSearchParams } from 'next/navigation';

interface BlogCardListProps {
  searchParams: ReadonlyURLSearchParams;
  visitedBlogIds: (number | string)[];
}

const BlogCardList = ({ searchParams, visitedBlogIds }: BlogCardListProps) => {
  const titleSlug = searchParams.get('title');

  const blogs: BlogInterface[] = blogData.blogs
    .filter((blog) => slugify(blog.title) !== titleSlug)
    .filter((blog) => !visitedBlogIds.includes(blog.id))
    .reverse()
    .slice(0, 3);

  if (blogs.length < 3) {
    const needed = 3 - blogs.length;
    const blogIdsToShow = blogs.map((blog) => blog.id);

    const fallbackBlogs = pickSeeded(
      blogData.blogs
        .filter((blog) => slugify(blog.title) !== titleSlug)
        .filter((blog) => !blogIdsToShow.includes(blog.id)),
      needed,
      `blog-fallback:${titleSlug ?? 'home'}:${visitedBlogIds.join(',')}`,
    );

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
