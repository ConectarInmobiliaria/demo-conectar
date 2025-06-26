/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oshfifwxyunzlzfxlahf.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};
export default nextConfig;
