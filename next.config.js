/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  async headers() {
    return [
      {
        source: "/api/webhooks/:path*",
        headers: [{ key: "Content-Type", value: "application/json" }],
      },
    ];
  },
};

module.exports = nextConfig;
