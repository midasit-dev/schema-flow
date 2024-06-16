module.exports = {
  devServer: {
    proxy: {
      '/backend': {
        target: process.env.REACT_APP_API_URL,
        changeOrigin: true,
        pathRewrite: { '^/backend': '' },
      },
    },
  },
};
