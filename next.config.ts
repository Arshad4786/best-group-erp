import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // This wildcard matches ANY Supabase project URL
        hostname: "**.supabase.co", 
        port: "",
        // This matches the standard storage path
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;