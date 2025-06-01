/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Permite imágenes de cualquier dominio
      },
    ],
  },
};

module.exports = nextConfig;