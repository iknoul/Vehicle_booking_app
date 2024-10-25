/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
      remotePatterns: [
          {
              protocol: 'http',
              hostname: '192.168.10.28',
              port: '9000',
              pathname: '/**',
          },
          {
              protocol: 'http',
              hostname: '192.168.10.25',
              port: '9000',
              pathname: '/**',
          },
      ],
  },
};

export default nextConfig;
