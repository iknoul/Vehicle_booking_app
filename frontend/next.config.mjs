/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
      domains: ['localhost', '192.168.10.28', '192.168.10.25'],
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
          {
            protocol: 'http',
            hostname: 'localhost',
            port: '9000',
            pathname: '/**',
        }
      ],
  },
};

export default nextConfig;
