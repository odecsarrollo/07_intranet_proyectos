var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.local.config');

// CORS headers function to dynamically set origin
var before = function(app, server) {
    app.use(function(req, res, next) {
        var origin = req.headers.origin;
        if (origin) {
            res.setHeader('Access-Control-Allow-Origin', origin);
            res.setHeader('Access-Control-Allow-Credentials', 'true');
        } else {
            res.setHeader('Access-Control-Allow-Origin', '*');
        }
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization, Cache-Control');
        if (req.method === 'OPTIONS') {
            return res.sendStatus(200);
        }
        next();
    });
};

new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    inline: true,
    historyApiFallback: true,
    headers: {
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization, Cache-Control"
    },
    before: before,
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    }
}).listen(3000, '127.0.0.1', function (err, result) {
    if (err) {
        console.log(err);
    }
    console.log('Listening at 127.0.0.1:3000');
});