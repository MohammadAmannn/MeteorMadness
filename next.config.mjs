/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['api.nasa.gov'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig