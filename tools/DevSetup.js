const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../webpack.config.dev');

function setupDev(app) {
  const compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    stats: {colors: true}
  }));

  app.use(webpackHotMiddleware(compiler, {
    log: console.log
  }));
}

module.exports = {
  setupDev: setupDev
};
