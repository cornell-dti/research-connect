
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const path = require('path');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

 const plugins =  [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
  new OptimizeCssAssetsPlugin({
    cssProcessorOptions: { discardComments: { removeAll: true } },
  }),
];

module.exports = {
  entry: './index.js',
  output: {
    path: `${__dirname}/docs`,
    publicPath: '/',
    filename: 'js/bundle.js',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react', 'es2015', 'stage-2'],
          },
        },
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: 'file-loader?limit=100000&name=./img/[hash].[ext]',
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../public/'
            }
          },
          "css-loader"
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        loader: 'url-loader?limit=100000&name=./fonts/[hash].[ext]',
      },
      {
        test: /\.scss$/,
        use: [{
          loader: 'style-loader',
        }, {
          loader: 'css-loader',
        }, {
          loader: 'sass-loader',
        }],
      },
    ],
  },
  plugins,
};
