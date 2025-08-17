'use client';

import { useSearchParams } from 'next/navigation';
import { useVisitedItems } from '@/app/hooks/useVisitedItems';
import BlogCardList from '../blog/BlogCardList';

const BlogCardListWrapper = () => {
  const searchParams = useSearchParams();
  const visitedBlogIds = useVisitedItems('blog', searchParams);

  return (
    <BlogCardList searchParams={searchParams} visitedBlogIds={visitedBlogIds} />
  );
};

export default BlogCardListWrapper;
