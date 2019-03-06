const path = require("path");

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: {
    app: ["./src/index.tsx"]
  },
  output: {
    filename: "[name].bundle.js",
    path: __dirname + "/../../app"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          configFile: "tsconfig.json"
        }
      },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ]
  },
  target: "node"
};
