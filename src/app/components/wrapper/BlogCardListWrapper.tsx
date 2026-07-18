'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useVisitedItems } from '@/app/hooks/useVisitedItems';
import BlogCardList from '../blog/BlogCardList';

const BlogCardListWrapperContent = () => {
  const searchParams = useSearchParams();
  const visitedBlogIds = useVisitedItems('blog', searchParams);

  return <BlogCardList searchParams={searchParams} visitedBlogIds={visitedBlogIds} />;
};

const BlogCardListWrapper = () => {
  return (
    <Suspense fallback={null}>
      <BlogCardListWrapperContent />
    </Suspense>
  );
};

export default BlogCardListWrapper;
