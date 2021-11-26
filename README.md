# change-prefix-loader
a loader to change element-ui class prefix

### 快速上手
```
vue cli3 
npm i change-prefix-loader

<!-- vue.config.js -->

chainWebpack: config => {
    config.module
        .rule('change-prefix')
        .test(/\.js$/)
        .include.add(path.resolve(__dirname, './node_modules/element-ui/lib'))
        .end()
        .use('change-prefix')
        .loader('change-prefix-loader')
        .end()
},
```

### options

* type Object

```
{
    prefix: 'el-'   //可选
    replace: 'gp-'  //可选
})
```
## 注意

该loader只会替换js中的class 前缀，css中的样式需要使用post-css替换，请见[postcss-change-css-prefix](https://www.npmjs.com/package/postcss-change-css-prefix)
