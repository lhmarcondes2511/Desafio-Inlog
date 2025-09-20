const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // Proxy all backend routes to avoid CORS in development
  // Adjust the context array if your backend serves other paths
  const context = [
    '/Veiculo',
    // add more contexts here if needed
  ];

  app.use(
    context,
    createProxyMiddleware({
      target: 'https://localhost:7222',
      changeOrigin: true,
      secure: false, // accept self-signed certificates in DEV
      ws: false,
      logLevel: 'debug',
    })
  );
};
