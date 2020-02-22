module.exports = {
  transpileDependencies: ["vuetify"],
  configureWebpack: {
    devtool: "source-map"
  },
  pwa: {
    iconPaths: {
      favicon32: "img/icons/favicon.ico",
      favicon16: "img/icons/favicon.ico"
    }
  }
};
