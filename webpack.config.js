const path = require('path');
// 插件都是一个类，所以我们命名的时候尽量用大写开头
const HtmlWebpackPlugin = require('html-webpack-plugin'); //打包html
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 提取出来css
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); // 压缩打包后的js 
const HappyPack = require('happypack'); // 多线程构建
const happyThreadPool = HappyPack.ThreadPool({ size: 5 });  // 构造出共享进程池，进程池中包含5个子进程

console.log('process.env.NODE_ENV------->',  process.env.NODE_ENV)
// 解决css 分离后图片引入路径不正确问题
if (process.env.type == 'build') { // 判断package.json里面是build还是dev命令
    // 开发
    var website ={
        publicPath:"./"
    }
} else {
    // 生产
    var website ={
        publicPath:"/"
    }
}


module.exports = {
    entry:{
        main: './src/js/main.js',
        add: './src/js/add.js',
        side: './src/js/side.js',
        tab: './src/js/tab.js'
    },
    output: {
    	filename: '[name].[chunkhash:6].js',
    	path: path.resolve('dist'),
        publicPath: website.publicPath // 解决css 分离后图片引入路径不正确问题
    },             
    module: {
    	rules: [
		    {
	            test: /\.css/,
                exclude: /node_modules/, // 取消匹配node_modules里面的文件
                // 需要注意'style-loader' 要在所有的loader前面 这是一个坑------------------>
	            use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader']
	        },
            {
                test: /\.less$/,
                exclude: /node_modules/, // 取消匹配node_modules里面的文件
                use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000, // limit：是把小于xxx(也就是xxxk)的文件打成Base64的格式，写入JS。否则就写入路径
                            name: '[name]_[hash:7].[ext]', // 打包图片的名字
                            outputPath:'static/images/' // 打包后放到images路径下
                        }
                    }
                ]
            },
            {
                test: /\.(htm|html)$/,
                use: 'html-withimg-loader'
            },
            // babel 解析es7 es6 jsx
            {
                test:/\.(jsx|js)$/,
                include: [ 
                    path.resolve(__dirname, 'src'), 
                    // 限定只在 src 目录下的 js/jsx 文件需要经 babel-loader 处理
                    // 通常我们需要 loader 处理的文件都是存放在 src 目录
                ],
                // use:['babel-loader'],
                use:['happypack/loader?id=js'], 
                /*
                    如果开启多线程进行构建
                    loader这样写 匹配下面注释的插件
                */
                exclude:/node_modules/ // 去除掉node_modules文件夹的js 不然node_modules也都转换了
            },
	    ]
    },              
    plugins: [
    	// 打包html
        new HtmlWebpackPlugin({
            // 在src目录下创建一个index.html页面当做模板来用
            template: './src/index.html',
            // inject: true,
            hash: true, // 会在打包好的bundle.js后面加上hash串
            // minify：是对html文件进行压缩，removeAttrubuteQuotes是去掉属性的双引号。
            minify: {
                minifyCSS: true, // 压缩 HTML 中出现的 CSS 代码
                minifyJS: true, // 压缩 HTML 中出现的 JS 代码
                // removeAttributeQuotes: true,
                removeComments: true,
                collapseWhitespace: true
            },
        }),

        // 把css从bundle.js中分离出来
        new MiniCssExtractPlugin({
	        filename: "static/css/[name].[chunkhash:8].css",
	        chunkFilename: "[id].css" // 此行可有可无
	    }),
        // new UglifyJsPlugin()
        // 多线程构建 匹配上面的loader
        new HappyPack({
            id: 'js',
             //threads: 4,
            loaders: ['babel-loader'],
            threadPool: happyThreadPool, // 使用共享进程池中的子进程去处理任务
            verbose: true,
            debug: true
        }),
        new CopyWebpackPlugin([{
            from : path.join('src/js/lib'),
            to   : path.join('static','lib')
        },{
            from : path.join('src/css'),
            to   : path.join('static','css')
        },{
            from : path.join('src/fonts'),
            to   : path.join('static','fonts')
        },{
            from : path.join('src/login.html'),
            to   : path.join('./','login.html')
        }])
    ],   
    // 提取公共代码
    optimization: {
        splitChunks: {
            cacheGroups: {
                // vendor: {   // 抽离第三方插件
                //     test: /lib/,   // 指定是node_modules下的第三方包
                //     chunks: 'initial',
                //     name: 'lib',  // 打包后的文件名，任意命名    
                //     // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
                //     priority: 10    
                // },
                common: {// ‘src/js’ 下的js文件
                    chunks:"all",
                    test:/[\\/]src[\\/]/,//也可以值文件/[\\/]src[\\/]js[\\/].*\.js/,  
                    name: "common", //生成文件名，依据output规则
                    minChunks: 2,
                    maxInitialRequests: 5,
                    minSize: 0,
                    priority:1
                }
                // utils: { // 抽离自己写的公共代码，utils这个名字可以随意起 (css/js公用的都会单独抽离出来生成一个单独的文件)
                //     chunks: 'initial',
                //     name: 'utils',  // 任意命名
                //     minSize: 0    // 只要超出0字节就生成一个新包
                // }
            }
        }
    },        
    devServer: {
        port: 3545
    },   
    resolve: {
        // 省略后缀
        extensions: ['.js', '.jsx', '.less', '.json'],
    },     
    mode: 'development' // 模式配置
}