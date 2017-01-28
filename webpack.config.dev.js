const path = require('path');
const merge = require('webpack-merge');
const validate = require('webpack-validator');
const parts = require('./libs/parts');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PATHS = {
  client: path.join(__dirname, 'client'),
  build: path.join(__dirname, 'build')
};

const common = {
// Entry accepts a path or an object of entries.
// We'll be using the latter form given it's
// convenient with more complex configurations.
  entry: [
    'webpack/hot/dev-server',
    'webpack-hot-middleware/client',
    PATHS.client
  ],
  output: {
    path: "/",
    publicPath: '/',
    filename: 'app.js'
  },
  plugins: [new HtmlWebpackPlugin({
    title: 'NightLife App',
    template: 'index.ejs',
    filename: 'index.html'
  })]
};


var config = merge(common,
  parts.setupCSS(PATHS.client),
  parts.setupBabel(),
  parts.devServer({
    // Customize host/port here if needed
    host: process.env.HOST,
    port: process.env.PORT
  }));

module.exports = validate(config);
