/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Remove 'output: export' to enable API routes
  // output: 'export',
  trailingSlash: true,
}

export default nextConfig
