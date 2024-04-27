const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

let currentTask = process.env.npm_lifecycle_event;

const PostCSSPlugins = [
    require('autoprefixer'),
    require('postcss-import'),
    require('postcss-nested'),
    require('postcss-mixins')
];

let cssConfig = {
    test: /\.css$/i,
    use: ['css-loader']
};

let config = {
 entry: {
    App: './app/assets/scripts/App.js'
 },
 module: {
    rules: [
        cssConfig
    ]
 },
 plugins: [new HtmlWebpackPlugin({filename: 'index.html', template: './app/assets/index.html'})]
}

if(currentTask == "dev") {
    config.mode = "development";
    config.output = {
        path: path.resolve(__dirname, 'app/assets')
    };
    config.devServer = {
        watchFiles: ["./app/**/*.html"],
        static: {
            directory: path.resolve(__dirname, "app/assets")
        },
        hot: true,
        port: 3000,
        host: '0.0.0.0'
    }
    cssConfig.use.unshift('style-loader');
    cssConfig.use.push({
        loader: 'postcss-loader',
        options: {
            postcssOptions: {
                plugins: PostCSSPlugins
            }
        }
    })
}

if(currentTask == "build") {
    config.mode = "production";
    config.output = {
        filename: '[name].[contenthash].js',
        chunkFilename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    config.optimization = {
        splitChunks: {
            chunks: 'all',
            minSize: 1000
        },
        minimize: true,
        minimizer: [`...`, new CssMinimizerPlugin()]
    }
    config.plugins.push(new MiniCssExtractPlugin({filename: 'styles.[contenthash].css'}))
    cssConfig.use.unshift(MiniCssExtractPlugin.loader)
}

module.exports = config;

