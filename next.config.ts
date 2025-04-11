/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    images: {
      domains: [
        'github.com',
        'githubusercontent.com',
        'raw.githubusercontent.com',
        'github-production-user-asset-6210df.s3.amazonaws.com'
      ],
    },
}

module.exports = nextConfig