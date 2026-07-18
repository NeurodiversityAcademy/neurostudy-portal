/** @type {import('next').NextConfig} */

const isProdCachingEnabled = process.env.NODE_ENV === 'production';

/** CDN-friendly: edge caches for 1h, soft-while-revalidate for a day. */
const MARKETING_CDN_CACHE_CONTROL =
  'public, s-maxage=3600, stale-while-revalidate=86400';

/** Course listing can change more often than marketing pages. */
const COURSE_CDN_CACHE_CONTROL =
  'public, s-maxage=1800, stale-while-revalidate=86400';

const HOME_ROBOTS_TAG =
  'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';

const marketingCacheHeader = {
  key: 'Cache-Control',
  value: MARKETING_CDN_CACHE_CONTROL,
};

/**
 * Site-wide Trust & Safety headers for Lighthouse Best Practices / XSS hardening.
 * script-src keeps 'unsafe-inline' for Next.js App Router bootstrap; tighten with
 * nonces later if needed.
 */
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  [
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
    'https://connect.facebook.net',
    'https://widget.tabnav.com',
    'https://va.vercel-scripts.com',
    'https://*.buzzsprout.com',
    'https://js.stripe.com',
  ].join(' '),
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  [
    "connect-src 'self'",
    'https://www.google-analytics.com',
    'https://*.google-analytics.com',
    'https://www.googletagmanager.com',
    'https://region1.google-analytics.com',
    'https://stats.g.doubleclick.net',
    'https://connect.facebook.net',
    'https://www.facebook.com',
    'https://*.facebook.com',
    'https://graph.facebook.com',
    'https://widget.tabnav.com',
    'https://vitals.vercel-insights.com',
    'https://va.vercel-scripts.com',
    'https://*.amazonaws.com',
    'https://*.amazoncognito.com',
    'https://*.cloudinary.com',
    'https://api.stripe.com',
    'https://checkout.stripe.com',
  ].join(' '),
  [
    "frame-src 'self'",
    'https://www.facebook.com',
    'https://js.stripe.com',
    'https://hooks.stripe.com',
    'https://checkout.stripe.com',
    'https://www.buzzsprout.com',
    'https://www.youtube.com',
    'https://player.vimeo.com',
  ].join(' '),
].join('; ');

const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Content-Security-Policy',
    value: CONTENT_SECURITY_POLICY,
  },
];

/**
 * Aggressive CDN caching for public marketing routes — production only.
 * Auth, checkout, profile, and personalized APIs are intentionally omitted.
 */
const prodCacheHeaders = [
  {
    source: '/',
    headers: [
      {
        key: 'X-Robots-Tag',
        value: HOME_ROBOTS_TAG,
      },
      marketingCacheHeader,
    ],
  },
  {
    source: '/about',
    headers: [marketingCacheHeader],
  },
  {
    source: '/contact',
    headers: [marketingCacheHeader],
  },
  {
    source: '/professionals',
    headers: [marketingCacheHeader],
  },
  {
    source: '/endorsements',
    headers: [marketingCacheHeader],
  },
  {
    source: '/neurodivergentmates',
    headers: [marketingCacheHeader],
  },
  {
    source: '/blogs',
    headers: [marketingCacheHeader],
  },
  {
    source: '/blogs/:path*',
    headers: [marketingCacheHeader],
  },
  {
    source: '/articles',
    headers: [marketingCacheHeader],
  },
  {
    source: '/articles/:path*',
    headers: [marketingCacheHeader],
  },
  {
    source: '/emergingproviders/:path*',
    headers: [marketingCacheHeader],
  },
  {
    // Live endorsed slugs are public; demo URLs include ?demo= and are separate cache keys.
    source: '/endorsedproviders/:slug',
    headers: [marketingCacheHeader],
  },
  {
    source: '/courses',
    headers: [
      {
        key: 'Cache-Control',
        value: COURSE_CDN_CACHE_CONTROL,
      },
    ],
  },
  {
    source: '/courses/:id',
    headers: [
      {
        key: 'Cache-Control',
        value: COURSE_CDN_CACHE_CONTROL,
      },
    ],
  },
  {
    source: '/sitemap.xml',
    headers: [
      {
        key: 'Cache-Control',
        value: 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    ],
  },
  {
    source: '/robots.txt',
    headers: [
      {
        key: 'Cache-Control',
        value: 'public, s-maxage=86400, stale-while-revalidate=604800',
      },
    ],
  },
];

const localHeaders = [
  {
    source: '/',
    headers: [
      {
        key: 'X-Robots-Tag',
        value: HOME_ROBOTS_TAG,
      },
      {
        key: 'Cache-Control',
        value: 'no-store',
      },
    ],
  },
];

const globalSecurityHeaders = [
  {
    source: '/:path*',
    headers: securityHeaders,
  },
];

module.exports = {
  images: {
    // Next 16 defaults qualities to [75]; keep 100 for existing hero/cover images.
    qualities: [75, 100],
    // S3/Cloudinary assets rarely change; longer TTL cuts image optimizer origin hits in prod.
    minimumCacheTTL: isProdCachingEnabled ? 60 * 60 * 24 : 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'neurostudyportal.s3.ap-southeast-2.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'neurostudyportal-assets.s3.ap-southeast-2.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'asset.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
    ],
  },
  headers: async () => [
    ...globalSecurityHeaders,
    ...(isProdCachingEnabled ? prodCacheHeaders : localHeaders),
  ],
};
