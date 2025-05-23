/** @type {import('next').NextConfig} */
/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
          pathname: '/dgsigv8cf/**', // Substitua pelo seu nome de pasta no Cloudinary
        },
        {
          protocol: 'https',
          hostname: 'puca-api.vercel.app',
          pathname: '/**',
        },
      ],
      domains: ['localhost', 'puca-api.vercel.app'],
      unoptimized: true,
    },
    typescript: {
      // !! WARN !!
      // Isso ignora erros de tipo durante a build
      // SOMENTE para implantação inicial, remova para build de produção final
      ignoreBuildErrors: true,
    },
    eslint: {
      // !! WARN !!
      // Isso ignora erros de ESLint durante a build
      // SOMENTE para implantação inicial, corrija os problemas antes de ir para produção
      ignoreDuringBuilds: true,
    },
    experimental: {
      // Reduzir o uso de CPUs para economizar memória durante o build no Netlify
      cpus: 1,
    },
  };
  
  export default nextConfig;
  
