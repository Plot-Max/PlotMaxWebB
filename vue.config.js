const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  productionSourceMap: false,
  transpileDependencies: true,
  publicPath: process.env.BASE_URL ,
  devServer:{
    open: false,
    port:8084,
    client:{
      overlay: false
    },
    proxy: {
      '/apis':{
        target: 'https://plot-max.com/',
        // target: 'http://plotmax.zdapk.cn/',
        changeOrigin: true,
        pathRewrite:{
          "^/apis":"apis"
        }
      }
    }
  },
  publicPath: process.env.BASE_URL,
})
