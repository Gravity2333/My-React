const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'none',
    devtool: 'source-map',
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, '../build'),
        filename: "[name]-[chunkhash:8]-bundle.js",
        // publicPath: '/manager',
        assetModuleFilename: '[name]-[hash:8][ext]',
        chunkFilename: 'async/[name]-[chunkhash:8].js',
        clean: true,
    },
    resolve: {
        extensions: ['.jsx', '.vue', '.js', '.ts', '.tsx'],
        mainFiles: ['index'],
        alias: {
            utils: path.resolve(__dirname, '../src/utils'),
            '@': path.resolve(__dirname, '../src/'),
        }
    },

    module: {
        rules: [
            {
                test: /\.ts/,
                use: 'ts-loader'
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './template.html'
        })
    ]
}