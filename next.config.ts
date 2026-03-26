import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
    serverComponentsExternalPackages: ["sequelize", "sequelize-typescript"],
  },
  serverExternalPackages: ["sequelize", "sequelize-typescript"],
};

export default nextConfig;
