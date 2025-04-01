const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "none",
  devtool: "source-map",
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name]-[chunkhash:8]-bundle.js",
    // publicPath: '/manager',
    assetModuleFilename: "[name]-[hash:8][ext]",
    chunkFilename: "async/[name]-[chunkhash:8].js",
    clean: true,
  },
  resolve: {
    extensions: [".jsx", ".vue", ".js", ".ts", ".tsx"],
    mainFiles: ["index"],
    alias: {
      utils: path.resolve(__dirname, "../src/utils"),
      "@": path.resolve(__dirname, "../src/"),
    },
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./template.html",
    }),
  ],

  optimization: {
    splitChunks: {
      chunks: 'all',  // 确保拆分的模块按正确的顺序加载
    },
  },

  devServer: {
    hot: false,  // 禁用热模块替换
  },
};
