/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/script.js",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*", // Or specify your domain: 'https://yourdomain.com'
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
