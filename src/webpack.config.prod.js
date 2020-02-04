const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const plugins = [
  new MiniCssExtractPlugin({
    filename: '[name].css',
    chunkFilename: '[id].css',
  }),
  new OptimizeCssAssetsPlugin({
    cssProcessorOptions: { discardComments: { removeAll: true } },
  }),
];

module.exports = {
  entry: './index.js',
  optimization: {
    minimize: true,
  },
  output: {
    path: `${__dirname}/docs`,
    publicPath: '/',
    filename: 'js/bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-proposal-class-properties'],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../public/',
            },
          },
          'css-loader',
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        use: [
          {
            loader: 'url-loader?limit=100000',
            options: {
              name: 'css/[hash].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader?limit=100000',
            options: {
              name: 'img/[hash].[ext]',
            },
          },
          'img-loader',
        ],
      },
      {
        test: /\.(ico|pdf)$/i,
        use: [
          'file-loader?name=./img/[name].[ext]',
        ],
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
