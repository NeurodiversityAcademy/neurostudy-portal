/** @type {import('next').NextConfig} */

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'neurostudyportal.s3.ap-southeast-2.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Add Cloudinary's hostname
      },
      {
        protocol: 'https',
        hostname: 'asset.cloudinary.com', // Add Cloudinary's hostname
      },
    ],
  },
  robotsHeaders: true,
  headers: async () => {
    return [
      {
        source: '/',
        headers: [
          {
            key: 'X-Robots-Tag',
            value:
              'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
          {
            key: 'Status',
            value: '200',
          },
        ],
      },
    ];
  },
};
