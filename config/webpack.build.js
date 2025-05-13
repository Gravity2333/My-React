const path = require("path");
module.exports = {
  mode: "production",
  entry: {
    react: "./lib/react",
    "react-dom": "./lib/react-dom",
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "[name].js",
    clean: true,
    library: {
      type: "module", // 👈 输出为 ESModule
    },
    environment: {
      module: true, // 告诉 Webpack 生成 ESModule 代码
    },
  },
  experiments: {
    outputModule: true, // 必须开启
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
          loader: "babel-loader",
        },
      },
    ],
  },

  optimization: {
    splitChunks: {
      chunks: "all", // 确保拆分的模块按正确的顺序加载
    },
  },
};
