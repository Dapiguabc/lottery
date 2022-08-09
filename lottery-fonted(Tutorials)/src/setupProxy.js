const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
  app.use(
   createProxyMiddleware('/socket.io', {
      target: 'http://165.22.47.195:3535',
      changeOrigin: true,
      ws: true
    })
  );
};

// http://165.227.181.34:3535