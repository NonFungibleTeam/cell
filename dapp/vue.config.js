module.exports = {
  transpileDependencies: ["vuetify"],
  configureWebpack: {
    devtool: "source-map"
  },
  pwa: {
    iconPaths: {
      favicon32: "img/icons/favicon.ico",
      favicon16: "img/icons/favicon.ico",
      appleTouchIcon: "img/logo.png",
      maskIcon: "img/logo.png",
      msTileImage: "img/logo.png"
    }
  }
};
