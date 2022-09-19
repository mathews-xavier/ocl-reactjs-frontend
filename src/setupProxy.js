const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://code-repo-mathew.herokuapp.com",
      changeOrigin: true,
    })
  );
};
