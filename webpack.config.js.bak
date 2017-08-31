var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var importGlobLoader = require('import-glob-loader');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = [{
    entry: {
        student_app: './src/student_app/boot.ts',
        teacher_app: './src/teacher_app/boot.ts'
    },
    output: {
        filename: './app/[name]/bundle.js'
    },
    // Turn on sourcemaps
    devtool: '#source-map',
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.js']
    },
    // Add minification
    // plugins: [
    //     new webpack.optimize.UglifyJsPlugin({
    //         compress: { warnings: false },
    //         output: { comments: false },
    //         sourceMap: true
    //     })
    // ],
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    target: 'web', // in order to ignore built-in modules like path, fs, etc.
    externals: [
        nodeExternals({
            importType: 'var',
            whitelist: [/^lodash/]
        }),
    ], // in order to ignore all modules in node_modules folder

    plugins: [
        new CopyWebpackPlugin([

            // Copy glob results, relative to context
            {
                context: './src',
                from: '**/*.html',
                to: './app'
            },

        ], {
                // By default, we only copy modified files during
                // a watch or webpack-dev-server build. Setting this
                // to `true` copies all files.
                copyUnmodified: true
            })
    ]
},
{
    // context: path.join(__dirname, 'src/css'),
    entry: {
        bundle: './src/css/app.scss'
    },
    output: {
        path: path.join(__dirname, 'app/css'),
        filename: '[name].css'
    },
    module: {
        //     loaders: [
        //         {
        //             test: /\.scss$/,
        //             loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader?-url&minimize&sourceMap!sass-loader!import-glob-loader' })
        //         }
        //     ]

        // loaders: [
        //     {
        //         test: /\.scss$/,
        //         loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader!postcss-loader' })
        //     }
        // ]

        loaders: [
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    loader: 'css-loader?sourceMap&importLoaders=1!postcss-loader'
                }),
            },
        ],

        // rules: [
        //     {
        //         test: /\.(css|scss)$/,
        //         loader: ExtractTextPlugin.extract({
        //             fallbackLoader: 'style-loader',
        //             loader: [
        //                 'css-loader',
        //                 'sass-loader',
        //                 'postcss-loader'
        //             ]
        //         })
        //     },
        //     // other rules
        //     // ...
        // ],

        // rules: [
        //     {
        //         test: /\.css$/,
        //         exclude: /node_modules/,
        //         use: [
        //             {
        //                 loader: 'style-loader',
        //             },
        //             {
        //                 loader: 'css-loader',
        //                 options: {
        //                     importLoaders: 1,
        //                 }
        //             },
        //             {
        //                 loader: 'postcss-loader'
        //             }
        //         ]
        //     }
        // ]
    },
    devtool: 'source-map',
    plugins: [
        // new webpack.LoaderOptionsPlugin({
        //     options: {
        //         postcss: [
        //             require('postcss-easy-import'),
        //             require('autoprefixer')({
        //                 browsers: ['last 2 versions']
        //             }),
        //         ]
        //     }
        // }),
        new ExtractTextPlugin('[name].css')
    ]
},
];