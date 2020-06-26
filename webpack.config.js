const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        main: './index.tsx'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.[contenthash].js'
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        },
        minimizer: [compiler => {
            const TerserWebpackPlugin = require('terser-webpack-plugin');
            new TerserWebpackPlugin().apply(compiler);
        }]
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: [/node_modules/, /service-worker.js/],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.(ts|tsx)?$/,
                loader: 'awesome-typescript-loader',
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    },
    resolve: {
        extensions: [ // исп в случае если мы не используем в import расширения
          '.tsx',
          '.ts',
          '.js'
        ]
    },
    devServer: {
        port: 3000,
        writeToDisk: true
    },
    devtool: 'source-map',
    plugins: [
        new HtmlWebpackPlugin({
            template: './assets/index.html', // require('html-webpack-template'),
            inject: 'body'
        }),
        new CopyWebpackPlugin([{
            from: './assets/data/bin',
            to: path.resolve(__dirname, 'dist/bin'),
            type: 'dir'
        },{
            from: './assets/data/img',
            to: path.resolve(__dirname, 'dist/img'),
            type: 'dir'
        },{
            from: './assets/manifest.json',
            to: path.resolve(__dirname, 'dist/'),
            type: 'file'
        },{
            from: './assets/manifest-512.png',
            to: path.resolve(__dirname, 'dist/'),
            type: 'file'
        },{
            from: './assets/manifest-192.png',
            to: path.resolve(__dirname, 'dist/'),
            type: 'file'
        },{
            from: './assets/data/metadata.json',
            to: path.resolve(__dirname, 'dist/metadata.json'),
            type: 'file'
        }
        //, 
        // {
        //     // from: './assets/manifest.json',
        //     // to: path.resolve(__dirname, 'dist/manifest.json'),
        //     // type: 'file'
        // }
        ]),
        new CleanWebpackPlugin(),
        new WorkboxPlugin.InjectManifest({
            swSrc: './assets/service-worker.js',
        })
        // new BundleAnalyzerPlugin()
    ]
}
