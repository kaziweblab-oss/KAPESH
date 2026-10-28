import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT:
      process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ?? process.env.IMAGEKIT_URL_ENDPOINT ?? "",
  },
  images: {
    loader: "custom",
    loaderFile: "./src/lib/imagekit-loader.ts",
  },
};

export default nextConfig;
