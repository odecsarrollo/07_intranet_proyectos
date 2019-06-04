var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.local.config');
var options = {
    publicPath: config.output.publicPath,
    hot: true,
    inline: false
};
WebpackDevServer.addDevServerEntrypoints(config, options);
var compiler = webpack(config);
var server = new WebpackDevServer(compiler, options);

server.listen(3000, '127.0.0.1', function (err, result) {
    if (err) {
        console.log(err);
    }
    if (result) {
        console.log(result)
    }
    console.log('Listening at 127.0.0.1:3000');
});