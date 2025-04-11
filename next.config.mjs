/** @type {import('next').NextConfig} */
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
          pathname: '/dgsigv8cf/**', // Substitua pelo seu nome de pasta no Cloudinary
        },
      ],
      domains: ['localhost'],
      unoptimized: true,
    },
  };
  
  export default nextConfig;
  
