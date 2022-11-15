module.exports = {
  css: {
    loaderOptions: {
      // 全局配置scss
      scss: {
        prependData: '@import "@/assets/scss/base.scss";'
      }
    }
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://yanxuan.xiecheng.live:7001',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  chainWebpack: config => {
    config.plugins.delete('prefetch')
  }
  // publicPath: '/yx',
  // outputDir: 'dest',
  // indexPath: 'index2.html',
  // productionSourceMap: false
}
