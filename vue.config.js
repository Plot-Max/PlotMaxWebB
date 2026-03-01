const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  productionSourceMap: false,
  transpileDependencies: true,
  publicPath: process.env.BASE_URL ,
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "@/assets/css/_variables.scss";`
      }
    }
  },
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
        },
        onProxyRes(proxyRes, req, res) {
          // let data = '';
          // proxyRes.on('data', (chunk) => {
          //   data += chunk;
          // });
          // proxyRes.on('end', () => {
          //   console.log('\n========== 代理响应日志 ==========');
          //   console.log('请求路径:', req.url);
          //   console.log('响应状态:', proxyRes.statusCode);
          //   try {
          //     const jsonData = JSON.parse(data);
          //     console.log('响应数据:', JSON.stringify(jsonData, null, 2));
          //   } catch (e) {
          //     console.log('响应数据:', data);
          //   }
          //   console.log('===================================\n');
          // });
        }
      }
    }
  },
  publicPath: process.env.BASE_URL,
})
