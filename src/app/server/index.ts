import express from 'express';
import next from 'next';
import { config } from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';
import https from 'https';
import fs from 'fs'; // 引入文件系统模块
import path from 'path';
import AppConfigEnv from '@/utils/get-config';

config({ path: '.env' });
const devProxy = {
  '/ai-love-web': {
    target: AppConfigEnv.HOST,
    pathRewrite: {
      '^/ai-love-web': '',
    },
    changeOrigin: true,
  },
};

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const start = () => {
  const server = express();
  if (dev && devProxy) {
    Object.keys(devProxy).forEach((context) => {
      server.use(
        context,
        createProxyMiddleware(devProxy[context as keyof typeof devProxy])
      );
    });
  }
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  app.prepare().then(() => {
    if (dev) {
      // 使用 HTTPS 证书和密钥创建 HTTPS 服务器
      const options = {
        key: fs.readFileSync(
          path.join(__dirname, '../../public/localhost+2-key.pem')
        ),
        cert: fs.readFileSync(
          path.join(__dirname, '../../public/localhost+2.pem')
        ),
      };

      // 创建 HTTPS 服务器
      https.createServer(options, server).listen(port, () => {
        console.log(`🎉🎉> Ready on https://localhost:${port}. Port: ${port}`);
      });
    } else {
      // 生产环境或其他环境下仍然使用 HTTP
      server.listen(port, () => {
        console.log(`🎉🎉> Ready on http://localhost:${port}. Port: ${port}`);
      });
    }
  });
};

start();
