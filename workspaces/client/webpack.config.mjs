import path from 'node:path';

import UnoCSS from '@unocss/webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

/** @type {import('webpack').Configuration} */
const config = {
  cache: process.env['CI']
    ? false
    : {
        allowCollectingMemory: true,
        type: 'filesystem',
      },
  // devtool: 'source-map',
  entry: './src/main.tsx',
  mode: process.env['NODE_ENV'] === 'development' ? 'development' : 'production',
  module: {
    rules: [
      { test: /\.css$/i, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
      {
        exclude: [/node_modules\/video\.js/, /node_modules\/@videojs/],
        resolve: {
          fullySpecified: false,
        },
        test: /\.(?:js|mjs|cjs|jsx|ts|mts|cts|tsx)$/,
        use: {
          loader: 'swc-loader',
        },
      },
      {
        test: /\.png$/,
        type: 'asset/resource',
      },
      {
        resourceQuery: /raw/,
        type: 'asset/source',
      },
      {
        resourceQuery: /arraybuffer/,
        type: 'javascript/auto',
        use: {
          loader: 'arraybuffer-loader',
        },
      },
    ],
  },
  optimization: {
    realContentHash: true,
  },
  output: {
    chunkFilename: 'chunk-[contenthash].js',
    filename: 'main.js',
    path: path.resolve(import.meta.dirname, './dist'),
    publicPath: 'auto',
  },
  plugins: [
    new BundleAnalyzerPlugin({ analyzerMode: 'static' }),
    new webpack.EnvironmentPlugin({ API_BASE_URL: '/api' }),
    UnoCSS(),
    new MiniCssExtractPlugin(),
  ],
  resolve: {
    extensions: ['.js', '.cjs', '.mjs', '.ts', '.cts', '.mts', '.tsx', '.jsx'],
  },
};

export default config;
