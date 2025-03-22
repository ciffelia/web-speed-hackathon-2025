import path from 'node:path';

import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
import { rspack } from '@rspack/core';
import UnoCSS from '@unocss/webpack';

/** @type {import('@rspack/core').Configuration} */
const config = {
  entry: './src/main.tsx',
  mode: process.env['NODE_ENV'] === 'development' ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.css$/i,
        type: 'javascript/auto',
        use: [rspack.CssExtractRspackPlugin.loader, 'css-loader'],
      },
      {
        exclude: [/node_modules\/video\.js/, /node_modules\/@videojs/],
        resolve: {
          fullySpecified: false,
        },
        test: /\.(?:js|mjs|cjs|jsx|ts|mts|cts|tsx)$/,
        type: 'javascript/auto',
        use: {
          // TODO: migrate to builtin:swc-loader
          loader: 'swc-loader',
        },
      },
    ],
  },
  optimization: {
    realContentHash: true,
  },
  output: {
    chunkFilename: 'chunk-[contenthash].js',
    clean: true,
    filename: 'main-[contenthash].js',
    path: path.resolve(import.meta.dirname, './dist'),
    publicPath: 'auto',
  },
  plugins: [
    new rspack.ProgressPlugin(),
    process.env['RSDOCTOR'] &&
      new RsdoctorRspackPlugin({
        disableClientServer: true,
        supports: {
          generateTileGraph: true,
        },
      }),
    new rspack.EnvironmentPlugin({ API_BASE_URL: '/api' }),
    UnoCSS(),
    new rspack.CssExtractRspackPlugin({
      chunkFilename: 'chunk-[contenthash].css',
      filename: 'main-[contenthash].css',
    }),
  ],
  resolve: {
    alias: {
      // workaround for rspack
      'uno.css$': path.resolve(import.meta.dirname, '__uno.css'),
    },
    extensions: ['.js', '.cjs', '.mjs', '.ts', '.cts', '.mts', '.tsx', '.jsx'],
  },
};

export default config;
