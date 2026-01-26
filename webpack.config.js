const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';
    const isDevelopment = !isProduction;

    return {
        entry: {
            // Main bundle
            main: './js/core/main.js',
            
            // Version config (separate for cache busting)
            version: './js/core/version-config.js',
        },
        
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: isProduction 
                ? 'js/[name].[contenthash:8].js' 
                : 'js/[name].js',
            chunkFilename: isProduction 
                ? 'js/[name].[contenthash:8].chunk.js' 
                : 'js/[name].chunk.js',
            assetModuleFilename: 'assets/[name].[contenthash:8][ext]',
            clean: true,
            publicPath: '/'
        },
        
        mode: isProduction ? 'production' : 'development',
        devtool: isProduction ? 'source-map' : 'eval-source-map',
        
        module: {
            rules: [
                // JavaScript
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env', {
                                    targets: '> 0.5%, last 2 versions, not dead',
                                    useBuiltIns: 'usage',
                                    corejs: { version: 3, proposals: true }
                                }]
                            ],
                            cacheDirectory: true
                        }
                    }
                },
                
                // CSS
                {
                    test: /\.css$/,
                    use: [
                        isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                        'css-loader'
                    ]
                },
                
                // Images
                {
                    test: /\.(png|jpg|jpeg|gif|svg|ico)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'images/[name].[contenthash:8][ext]'
                    }
                },
                
                // Fonts
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'fonts/[name].[contenthash:8][ext]'
                    }
                },
                
                // Audio
                {
                    test: /\.(mp3|wav|ogg)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'audio/[name].[contenthash:8][ext]'
                    }
                }
            ]
        },
        
        plugins: [
            // Clean dist folder
            new CleanWebpackPlugin(),
            
            // Generate HTML
            new HtmlWebpackPlugin({
                template: './index.html',
                filename: 'index.html',
                inject: 'body',
                minify: isProduction ? {
                    collapseWhitespace: true,
                    removeComments: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    useShortDoctype: true
                } : false
            }),
            
            // Extract CSS
            ...(isProduction ? [
                new MiniCssExtractPlugin({
                    filename: 'css/[name].[contenthash:8].css',
                    chunkFilename: 'css/[name].[contenthash:8].chunk.css'
                })
            ] : []),
            
            // Copy static assets
            new CopyWebpackPlugin({
                patterns: [
                    // CSS files (keep external for now, can be bundled later)
                    { from: 'css', to: 'css', noErrorOnMissing: true },
                    
                    // Data files
                    { from: 'js/data', to: 'js/data', noErrorOnMissing: true },
                    
                    // Audio files
                    { from: 'audio', to: 'audio', noErrorOnMissing: true },
                    
                    // Images
                    { from: 'images', to: 'images', noErrorOnMissing: true },
                    
                    // Manifest & other root files
                    { from: 'manifest.json', to: 'manifest.json', noErrorOnMissing: true },
                    { from: 'favicon.ico', to: 'favicon.ico', noErrorOnMissing: true },
                    { from: 'robots.txt', to: 'robots.txt', noErrorOnMissing: true }
                ]
            }),
            
            // Bundle analyzer (only when --env analyze is set)
            ...(env && env.analyze ? [
                new BundleAnalyzerPlugin({
                    analyzerMode: 'static',
                    openAnalyzer: true,
                    reportFilename: 'bundle-report.html'
                })
            ] : [])
        ],
        
        optimization: {
            minimize: isProduction,
            minimizer: [
                // Minify JS
                new TerserPlugin({
                    terserOptions: {
                        compress: {
                            drop_console: isProduction, // Remove console.log in production
                            drop_debugger: true,
                            pure_funcs: isProduction ? ['console.log', 'console.debug'] : []
                        },
                        format: {
                            comments: false
                        }
                    },
                    extractComments: false
                }),
                
                // Minify CSS
                new CssMinimizerPlugin()
            ],
            
            // Code splitting
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    // Vendor libraries (external dependencies)
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendor',
                        priority: 10,
                        reuseExistingChunk: true
                    },
                    
                    // Core modules (config, game, etc)
                    core: {
                        test: /[\\/]js[\\/]core[\\/]/,
                        name: 'core',
                        priority: 5,
                        minChunks: 2,
                        reuseExistingChunk: true
                    },
                    
                    // UI modules
                    ui: {
                        test: /[\\/]js[\\/]ui[\\/]/,
                        name: 'ui',
                        priority: 5,
                        minChunks: 2,
                        reuseExistingChunk: true
                    },
                    
                    // Systems modules
                    systems: {
                        test: /[\\/]js[\\/]systems[\\/]/,
                        name: 'systems',
                        priority: 5,
                        minChunks: 2,
                        reuseExistingChunk: true
                    },
                    
                    // Utils modules
                    utils: {
                        test: /[\\/]js[\\/]utils[\\/]/,
                        name: 'utils',
                        priority: 5,
                        minChunks: 2,
                        reuseExistingChunk: true
                    },
                    
                    // Common modules (shared across multiple entry points)
                    common: {
                        name: 'common',
                        minChunks: 2,
                        priority: 1,
                        reuseExistingChunk: true
                    }
                }
            },
            
            // Runtime chunk for better caching
            runtimeChunk: 'single',
            
            // Module IDs for better caching
            moduleIds: 'deterministic'
        },
        
        resolve: {
            extensions: ['.js', '.json'],
            alias: {
                '@core': path.resolve(__dirname, 'js/core'),
                '@ui': path.resolve(__dirname, 'js/ui'),
                '@systems': path.resolve(__dirname, 'js/systems'),
                '@utils': path.resolve(__dirname, 'js/utils'),
                '@data': path.resolve(__dirname, 'js/data'),
                '@css': path.resolve(__dirname, 'css')
            }
        },
        
        devServer: {
            static: {
                directory: path.join(__dirname, 'dist')
            },
            compress: true,
            port: 8080,
            hot: true,
            open: true,
            historyApiFallback: true,
            client: {
                overlay: {
                    errors: true,
                    warnings: false
                }
            }
        },
        
        performance: {
            hints: isProduction ? 'warning' : false,
            maxEntrypointSize: 512000, // 500kb
            maxAssetSize: 512000
        },
        
        stats: {
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }
    };
};
