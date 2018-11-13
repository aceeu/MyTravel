const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: { main: './src/index.tsx'},
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js'
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
            }
        ]
    },
    resolve: {
        extensions: [
          '.tsx',
          '.ts',
          '.js'
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html', // require('html-webpack-template'),
            inject: true,
            appMountId: 'app',
        })
    ],
    externals: {
        "react": "React",
        "react-dom": "ReactDOM",
        "leaflet": "L"
    }
}
