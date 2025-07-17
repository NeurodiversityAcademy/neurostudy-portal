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
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index, follow',
          },
        ],
      },
    ];
  },
};
