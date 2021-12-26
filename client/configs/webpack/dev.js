const { merge } = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const commonConfig = require('./common');

module.exports = merge(commonConfig, {
  mode: 'development',
  entry: path.resolve(__dirname, '../../src/index.tsx'),
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, '../../dist'),
    hot: true,
    open: true,
    port: 4000,
    watchContentBase: true,
  },
  plugins: [new webpack.HotModuleReplacementPlugin(), new ReactRefreshWebpackPlugin()],
});
