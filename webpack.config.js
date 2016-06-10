const webpack = require('webpack');
module.exports = {
    entry: {
        main: './public/main.jsx'
    },
    output: {
        path: './build',
        filename: '[name].bundle.js'
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel'
        }]
    }
}
