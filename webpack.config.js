var path = require('path');
var webpack = require('webpack');

module.exports = {
  target: 'web',
  entry: [
      './src/index'
  ],
  output: {
    path: path.join(__dirname, 'src'),
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: [ 'babel' ],
        include: path.join(__dirname, 'src')
      }
    ]
  },
  resolve: {
    extensions: [ '', '.js', '.json' ],
    alias: {
      'child_process': 'child-process-ws'
    }
  }
};
