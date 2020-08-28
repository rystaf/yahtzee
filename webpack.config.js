const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env = {}) => ({
  mode: env.production ? 'production' : 'development',
  context: path.resolve(__dirname, 'src'),
  entry: {
    main: './main.js',
  },
  devtool: env.production ? '' : 'eval-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    chunkFilename: '[name].bundle.js',
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  optimization: {
    minimize: env.production,
    minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin({})],
  },
  plugins: [
    new HtmlWebpackPlugin({
      minify: env.production,
      title: 'Yahtzee!',
      favicon: './images/logo.png',
      meta: {
        viewport: 'width=device-width, minimum-scale=1, initial-scale=1.0',
        'X-UA-Compatible': { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
      },
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new LiveReloadPlugin({
      appendScriptTag: !env.production,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
        ],
      },
    ],
  },
});
