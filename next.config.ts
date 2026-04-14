import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Libera o CORS para todas as rotas da API
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date",
          },
        ],
      },
    ];
  },
  experimental: {
    typedRoutes: true,
    serverComponentsExternalPackages: ["sequelize", "sequelize-typescript"],
  },
  serverExternalPackages: ["sequelize", "sequelize-typescript"],
};

export default nextConfig;
