var webpack = require('webpack'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  path = require('path')

module.exports = [
  {
    name: 'browser',
    entry: {
      main: './src-client/main.js',
    },
    output: {
      path: path.resolve('../node_modules/react-gui-builder/static'),
      filename: '[name].js',
    },
    devtool: 'inline-source-map',
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
            presets: [
              [
                'es2015',
                {
                  modules: false,
                },
              ],
              'react',
              'stage-0',
            ],
          },
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          loader: ExtractTextPlugin.extract({
            fallbackLoader: 'style-loader',
            loader: 'css-loader',
          }),
        },
        {
          test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)([\?]?.*)$/,
          exclude: /node_modules/,
          loader: 'url-loader',
        },
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          loader: ExtractTextPlugin.extract({
            fallbackLoader: 'style-loader',
            use: ['css-loader', 'sass-loader'],
          }),
        },
      ],
    },
    plugins: [new ExtractTextPlugin({ filename: 'styles.css' })],
    externals: {
      jquery: 'jQuery',
    },
    resolve: {
      modules: ['src-client', 'node_modules'],
      extensions: ['.js', '.jsx', '.react.js'],
    },
  },
]
