const webpack = require('webpack');
 module.exports = {
     entry: {
         app: './public/js/app.jsx'
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
