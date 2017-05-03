var path = require('path');
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker')


module.exports = function() {
  

    return {
            context: __dirname,

            //devtool: '#eval-source-map',
            entry: {  //Friends: './Friends.jsx',
                    SetGame: './SetGame.jsx'
            },
            output: {
            //path: path.join(__dirname,i '../examples/'),
            path: path.resolve('../coolcalproject/coolcal/cal/static/bundles/local/'),

            filename: '[name].js'
            },

            plugins: [
            
            new webpack.NoErrorsPlugin(),
            new BundleTracker({filename: '../coolcalproject/coolcal/webpack-stats-bigcalendar.json'})

            ],

            module: {
                rules: [
                {
                    test: /\.less$/,
                    use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'],
                 },
                {
                    test: /\.jsx/,
                    exclude: [/node_modules/],
                    use: [{
                        loader: 'babel-loader',
                        options: { presets: [ "react", "es2015", "stage-0"] },
                    }]
                }

              
            ]
          }
    }
};
