const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin'); // Import CopyPlugin
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';
    const shouldAnalyze = env && env.analyze;

    return {
        entry: {
            main: './js/main.js',
            styles: './css/styles-bundle.css'
        },
        
        output: {
            filename: 'js/[name].bundle.js',
            path: path.resolve(__dirname, 'dist'),
            publicPath: '/', // Set publicPath to root
            clean: true, // Clean the dist folder before each build
        },
        
        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: [
                        isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                        'css-loader'
                    ]
                }
            ]
        },
        
        plugins: [
            // Copy index.html to dist
            new CopyPlugin({
                patterns: [
                    { from: 'index.html', to: 'index.html' }
                ],
            }),
            new MiniCssExtractPlugin({
                filename: 'css/[name].css'
            }),
            ...(shouldAnalyze ? [new BundleAnalyzerPlugin()] : [])
        ],
        
        optimization: {
            minimize: isProduction,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        compress: {
                            drop_console: isProduction,
                            passes: 2
                        },
                        mangle: {
                            safari10: true
                        },
                        format: {
                            comments: false
                        }
                    },
                    extractComments: false
                }),
                new CssMinimizerPlugin()
            ],
            runtimeChunk: 'single'
        },
        
        devtool: isProduction ? false : 'eval-source-map',
        
        performance: {
            hints: false,
        },
        
        devServer: {
            static: { 
                directory: path.join(__dirname, 'dist') // Serve from dist
            },
            compress: true,
            port: 8081, // Changed port to 8081
            hot: true,
            open: true
        },
        
        resolve: {
            extensions: ['.js', '.json'],
            alias: {
                '@core': path.resolve(__dirname, 'js/core'),
                '@ui': path.resolve(__dirname, 'js/ui'),
                '@systems': path.resolve(__dirname, 'js/systems'),
                '@utils': path.resolve(__dirname, 'js/utils'),
                '@data': path.resolve(__dirname, 'js/data')
            }
        },
    };
};
