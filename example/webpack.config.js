export default [
  {
    mode: 'production',
    name: 'bundling javascript files',
    entry: __dirname + '/src/entry.js',
    output: {
      filename: 'app.js',
      path: __dirname + '/build'
    },
    module: {
      rules: [
        {
          test: /\.js/,
          loader: 'babel-loader',
          exclude: /node_modules/
        }
      ]
    }
  }
];