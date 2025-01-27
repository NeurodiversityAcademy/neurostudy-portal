/** @type {import('next').NextConfig} */

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'neurostudyportal.s3.ap-southeast-2.amazonaws.com',
        
      },
    ],
  },
  
};
