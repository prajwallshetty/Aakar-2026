import { NextConfig } from "next"

const nextConfig:NextConfig = {
    images: {
      remotePatterns: [
        new URL("https://github.com/**"),
        new URL('https://githubusercontent.com/**'),
        new URL('https://raw.githubusercontent.com/**'),
        new URL('https:github-production-user-asset-6210df.s3.amazonaws.com/**')
      ],
    },
}

module.exports = nextConfig