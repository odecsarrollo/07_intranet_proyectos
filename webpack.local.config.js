var path = require('path');
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');

var config = require('./webpack.base.config.js');

config.entry = {
    'app': [
        // Hot reload deshabilitado temporalmente debido a problemas con WebSocket en proxy de Django
        // Descomentar estas líneas si quieres usar hot reload (requiere configuración adicional)
        // 'react-hot-loader/patch',
        // 'webpack-dev-server/client?http://127.0.0.1:3000/',
        // 'webpack/hot/only-dev-server',
        './static/assets/js/index'
    ]
};
config.mode = "development";
config.devtool = 'eval-source-map';

config.output.publicPath = 'http://localhost:3000/static/assets/bundles/deve/';
config.output.path = path.resolve(__dirname, './static/assets/bundles/deve/');

config.plugins = config.plugins.concat([
    new BundleTracker({filename: './webpack-stats-local.json'}),
    // HotModuleReplacementPlugin deshabilitado junto con el hot reload
    // new webpack.HotModuleReplacementPlugin(),
]);

config.module.rules.push(
    {
        test: /\.css$/,
        use: [
            {loader: "style-loader"},
            {loader: "css-loader"},
        ]
    }
);
module.exports = config;