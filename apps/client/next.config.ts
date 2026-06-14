import type { NextConfig } from "next";

const nextConfig: NextConfig = {
      images:{
        remotePatterns:[
          {
            protocol:"https",
            hostname:"res.cloudinary.com",
          },
        ]
      },
      transpilePackages: ["@repo/types", "@repo/product-db", "@repo/order-db"],
};

export default nextConfig;
