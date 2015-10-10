var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');

var os = require('os');

var ip = 'localhost';

var parseInterface = function (c, i) {
  if(c.family === 'IPv4') {
    ip = c.address;
  }
};

var ifaces = os.networkInterfaces();
if (ifaces.wlan0) {
  ifaces.wlan0.forEach(parseInterface);
}

module.exports = {
  target: 'web',
  entry: [
      './src/index'
  ],
  output: {
    path: path.join(__dirname, 'src'),
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        DEBUG: JSON.stringify("*"),
        IP: JSON.stringify(ip)
      }
    }),
    new ExtractTextPlugin('app.css')
  ],
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

