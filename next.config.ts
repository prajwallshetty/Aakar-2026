import { NextConfig } from "next"

const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
];

const nextConfig:NextConfig = {
    images: {
      remotePatterns: [
        new URL("https://github.com/**"),
        new URL('https://githubusercontent.com/**'),
        new URL('https://raw.githubusercontent.com/**'),
        new URL('https:github-production-user-asset-6210df.s3.amazonaws.com/**')
      ],
    },
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: securityHeaders,
        },
      ];
    },
}

module.exports = nextConfig