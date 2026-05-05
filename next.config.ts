import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.guestplaygolf.com",
          },
        ],
        destination: "https://guestplaygolf.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;