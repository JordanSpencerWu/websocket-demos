const path = require('path');
const webpack = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  optimization: {
    usedExports: true,
  },
  entry: './src/index.tsx',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, '../../dist'),
    hot: true,
    open: true,
    port: 4000,
    watchContentBase: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Web Client',
      template: './src/index.html',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin(),
    new TsconfigPathsPlugin({ configFile: 'tsconfig.json' }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              plugins: [require.resolve('react-refresh/babel')],
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      components: path.resolve(__dirname, '../../src/components'),
    },
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../../dist'),
    clean: true,
  },
};
