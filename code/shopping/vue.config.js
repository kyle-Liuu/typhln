const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  // 默认是 '/',可以保证在非根目录和双击打开
  publicPath: './',
  transpileDependencies: true
})
