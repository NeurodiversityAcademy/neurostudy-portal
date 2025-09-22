import type { Metadata } from 'next';
import React from 'react';
import articleData from '../articleData.json';
import { MetadataProps } from '@/app/interfaces/MetadataProps';
import { HOST_URL } from '@/app/utilities/constants';
import { slugify } from '@/app/utilities/common';
import ArticleClientComponent from './ArticleClientComponent';

export async function generateMetadata({
  searchParams,
}: MetadataProps): Promise<Metadata> {
  const titleSlug = searchParams?.title;
  const { articles } = articleData;
  const article = articles.find(({ title }) => slugify(title) === titleSlug);

  if (!article) {
    return {};
  }

  const { title, keywords, description, imageUrl } = article;
  const canonical = `${HOST_URL}/articles/article?articleId=${titleSlug}`;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'article',
      siteName: 'Neurodiversity Academy',
      locale: 'en_US',
    },
    alternates: {
      canonical,
    },
  };
}
export default function OneArticle({ searchParams }: MetadataProps) {
  const titleSlug = searchParams?.title;
  const { articles } = articleData;
  const article = articles.find(
    (article) => slugify(article.title) === titleSlug
  );

  if (!article) {
    return <div>Article not found</div>;
  }

  // Pass the article data to the client component
  return <ArticleClientComponent article={article} />;
}
