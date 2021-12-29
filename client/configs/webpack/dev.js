const { merge } = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const commonConfig = require('./common');

const PORT = 3000;

module.exports = merge(commonConfig, {
  mode: 'development',
  entry: path.resolve(__dirname, '../../src/index.tsx'),
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, '../../dist'),
    historyApiFallback: true,
    hot: true,
    open: true,
    port: PORT,
    watchContentBase: true,
  },
  plugins: [new webpack.HotModuleReplacementPlugin(), new ReactRefreshWebpackPlugin()],
});
