import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4500",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "192.168.*.*",
        port: "4500",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "10.*.*.*",
        port: "4500",
        pathname: "/uploads/**",
      },
      
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "graph.facebook.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
