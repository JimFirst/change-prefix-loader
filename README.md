# change-prefix-loader
a loader to change element-ui class prefix

### 快速上手
```
vue cli3及以上
npm i change-prefix-loader -D

<!-- vue.config.js -->

module.exports = {
    chainWebpack: config => {
        config.module
            .rule('change-prefix')
            .test(/\.js$/)
            .include.add(path.resolve(__dirname, './node_modules/element-ui/lib'))
            .end()
            .use('change-prefix')
            .loader('change-prefix-loader')
            .options({
                prefix: 'el-',
                replace: 'gp-',
                exclude = 'icon'
            })
            .end()
    },
}
```
```
vue cli2

npm i change-prefix-loader -D

<!-- build/webpack.base.conf.js -->
module.exports = {
    module: {
        rules: {
            <!-- 新增该rule -->
            {
                test: /\.js$/,
                loader: 'change-prefix-loader',
                include: path.resolve(__dirname, '../node_modules/element-ui/lib'),
                options: {
                    replace: 'gp-',
                }
            }
        }
    }
}

```

### options

* type Object

```
{
    prefix: 'el-',  //可选
    replace: 'gp-'  //可选
    exclude: 'icon' // 可选，不替换el-icon, 默认为''
}
```
## 注意

该loader只会替换js中的class 前缀，css中的样式需要使用post-css替换，请见[postcss-change-css-prefix](https://www.npmjs.com/package/postcss-change-css-prefix)
