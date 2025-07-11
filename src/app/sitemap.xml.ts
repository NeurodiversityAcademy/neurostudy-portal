import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://neurodiversityacademy.com/',
      lastModified: new Date(),
    },
    {
      url: 'https://neurodiversityacademy.com/endorsements',
      lastModified: new Date(),
    },
    {
      url: 'https://neurodiversityacademy.com/contact',
      lastModified: new Date(),
    },
    {
      url: 'https://neurodiversityacademy.com/about',
      lastModified: new Date(),
    },
    {
      url: 'https://neurodiversityacademy.com/neurodivergentmates',
      lastModified: new Date(),
    },
    {
      url: 'https://neurodiversityacademy.com/login',
      lastModified: new Date(),
    },
    {
      url: 'https://neurodiversityacademy.com/signup',
      lastModified: new Date(),
    },
    // Add more URLs as needed
  ];
}
