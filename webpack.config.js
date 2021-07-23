const path = require('path');
const ConcatPlugin = require('webpack-concat-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'production',
    entry: {
        'webpack-entry.css': [
            path.resolve(__dirname, 'css/reset.css'),
            path.resolve(__dirname, 'css/main.css')
        ]
    },
    output: {
        filename: '[name]',
        path: path.resolve(__dirname, 'build')
    },
    module: {
        rules: [
            {
                test: /\.(svg|png|jpg|gif)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'image/',
                            publicPath: 'image'
                        }
                    }
                ]
            },
            {
                test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'font/',
                            publicPath: 'font'
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    'css-loader'
                ]
            }
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '/css/min.css',
            chunkFilename: '[id].css'
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /css\/min.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                preset: [
                    'default',
                    {
                        discardComments: {
                            removeAll: true
                        }
                    }
                ],
            },
            canPrint: true
        }),
        new ConcatPlugin(
            {
                uglify: true,
                name: 'top-min',
                fileName: 'js/[name].js',
                filesToConcat: [
                    path.resolve(__dirname, 'libs/jquery.min.js'),
                    path.resolve(__dirname, 'libs/jstorage.js'),
                    path.resolve(__dirname, 'libs/phaser.min.js'),
                    path.resolve(__dirname, 'libs/howler.min.js')
                ]
            }
        ),
        new ConcatPlugin(
            {
                uglify: true,
                name: 'bottom-min',
                fileName: 'js/[name].js',
                filesToConcat: [
                    path.resolve(__dirname, 'src/controller.js'),
                    path.resolve(__dirname, 'src/global.js'),
                    path.resolve(__dirname, 'src/item.js'),
                    path.resolve(__dirname, 'src/mainscene.js'),
                    path.resolve(__dirname, 'src/gamescene.js'),
                    path.resolve(__dirname, 'src/gameoverscene.js'),
                    path.resolve(__dirname, 'src/preload.js')
                ]
            }
        )
    ]
};














