switch (process.env.NODE_ENV) {
  case 'prod':
  case 'production':
    module.exports = require('./config/webpack.prod');
    break;

  case 'dev':
  case 'development':
  default:
    module.exports = require('./config/webpack.dev');
}

// module.exports = {
//   module: {
//     rules: [
//       {
//         test: /\.css$/,
//         use: [
//           'style-loader',
//           'css-loader'
//         ]
//       },
//       {
//         test: /\.(png|jp(e*)g|svg)$/,
//         use: [{
//           loader: 'url-loader',
//           options: {
//             limit: 20000, // Convert images < 8kb to base64 strings
//             name: 'images/[hash]-[name].[ext]'
//           }
//         }]
//       },
//       {
//         test: /\.(jpe?g|png|jp(e*)g|gif|svg)$/i,
//         loader: "file-loader?name=[name].[ext]"
//       }
//     ]
//   }
// };

