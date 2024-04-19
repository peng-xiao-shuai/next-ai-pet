const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.ailov3.com',
        port: '',
        pathname: '**',
      },
    ],
  },
  webpack: (config) => {
    // 设置别名
    config.resolve.alias['@'] = path.join(__dirname, 'src')

    // 重要: 返回修改后的配置
    return config
  },
}

module.exports = nextConfig