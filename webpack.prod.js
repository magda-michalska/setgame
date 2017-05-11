var path = require('path');
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker')


module.exports =  {
            context: __dirname,

            //devtool: '#eval-source-map',
            entry: {  //Friends: './Friends.jsx',
                    SetGame: './SetGame.jsx'
            },
            output: {
            //path: path.join(__dirname,i '../examples/'),
            path: path.resolve('./dist/static/'),

            filename: '[name].js'
            },

            plugins: [
            
            new webpack.NoErrorsPlugin(),
            //new BundleTracker({filename: '../coolcalproject/coolcalendar/webpack-stats-bigcalendar.json'})
            new webpack.LoaderOptionsPlugin({
                minimize: true,
                debug: false
            }),
            new webpack.DefinePlugin({
                'process.env': {
                'NODE_ENV': JSON.stringify('production')
                }
            }),
            new webpack.optimize.UglifyJsPlugin({
                beautify: false,
                mangle: {
                    screw_ie8: true,
                    keep_fnames: true
                },
                compress: {
                  screw_ie8: true
                },
                comments: false
            })
            ],

            module: {
                rules: [
                {
                    test: /\.less$/,
                    use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'],
                 },
                {
                    test: /\.jsx$/,
                    exclude: [/node_modules/],
                    use: [{
                        loader: 'babel-loader',
                        options: { presets: [ "react", "es2015", "stage-0"] },
                    }]
                },
                {
                    test: /\.js$/,
                    exclude: [/node_modules/],
                    use: [{
                        loader: 'babel-loader',
                        options: { presets: [ "react", "es2015", "stage-0"] },
                    }]
                }


              
            ]
          }
    
};
