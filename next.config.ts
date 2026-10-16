import type { NextConfig } from "next";

// ponytail: hardcoded default for production Render backend; override with
// BACKEND_API_URL env (e.g. http://localhost:8080 for local docker-compose).
const backendUrl =
  process.env.BACKEND_API_URL ?? "https://crack-backend-0okp.onrender.com";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Proxy API through this origin so auth cookies (auth_token) stay
  // same-origin — Next.js middleware cannot read cross-domain cookies.
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
