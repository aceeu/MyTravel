const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

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
                exclude: /node_modules/,
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
        port: 3000
    },
    devtool: 'source-map',
    plugins: [
        new HtmlWebpackPlugin({
            template: './assets/index.html', // require('html-webpack-template'),
            inject: 'body'
        }),
        new CopyWebpackPlugin([{
            from: './assets/data/ural20',
            to: path.resolve(__dirname, 'dist/ural20'),
            type: 'dir'
        }
        ]),
        new CleanWebpackPlugin()
    ]
}
