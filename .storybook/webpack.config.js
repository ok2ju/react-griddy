const path = require('path');

module.exports = {
  resolve: {
    extensions: ['', '.js', '.jsx', 'json', '.scss'],
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        loaders: ['eslint'],
        include: [
          path.resolve(__dirname, "../components")
        ],
      }
    ],
    loaders: [
      {
        test: /\.scss$/,
        loaders: [
          'style',
          'css?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
          'sass'
        ],
        include: [
          path.resolve(__dirname, '../components'),
          path.resolve(__dirname, '../examples'),
        ]
      },
      {
        test: /\.json$/,
        loader: 'json'
      }
    ]
  }
};
