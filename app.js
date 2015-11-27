/**
 * Require Browsersync along with webpack and middleware for it
 */
const browserSync          = require('browser-sync').create();
const webpack              = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const stripAnsi            = require('strip-ansi');

/**
 * Require ./webpack.config.js and make a bundler from it
 */
const webpackConfig   = require('./webpack.config');
webpackConfig.debug   = true;
webpackConfig.devtool = '#eval-source-map';
const bundler         = webpack(webpackConfig);

/**
 * Reload all devices when bundle is complete
 * or send a fullscreen error message to the browser instead
 */
bundler.plugin('done', function (stats) {
    if (stats.hasErrors() || stats.hasWarnings()) {
        return browserSync.sockets.emit('fullscreen:message', {
            title: "Webpack Error:",
            body:  stripAnsi(stats.toString()),
            timeout: 100000
        });
    }
    browserSync.reload();
});

/**
 * Run Browsersync and use middleware for Hot Module Replacement
 */
browserSync.init({
    server: 'app',
    open: false,
    logFileChanges: false,
    middleware: [
        webpackDevMiddleware(bundler, {
            publicPath: webpackConfig.output.publicPath,
            stats: {colors: true}
        })
    ],
    plugins: ['bs-fullscreen-message'],
    files: [
        'app/css/*.css',
        'app/*.html'
    ]
});
