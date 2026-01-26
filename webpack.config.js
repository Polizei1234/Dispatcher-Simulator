const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';
    const shouldAnalyze = env && env.analyze;

    return {
        entry: {
            // Hauptbundle: Core + Game Logic
            main: './js/core/main.js',
            
            // UI Bundle: Alle UI-Komponenten
            ui: './js/ui/ui.js',
            
            // Systems Bundle: AI, Weather, Radio etc.
            systems: './js/systems/call-system.js',
            
            // Styles Bundle
            styles: './css/style.css'
        },
        
        output: {
            filename: isProduction ? 'js/[name].[contenthash:8].bundle.js' : 'js/[name].bundle.js',
            path: path.resolve(__dirname, 'dist'),
            clean: true,
            publicPath: '/dist/'
        },
        
        module: {
            rules: [
                // CSS Handling
                {
                    test: /\.css$/i,
                    use: [
                        isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                        'css-loader'
                    ]
                },
                
                // JavaScript (optional: Babel für ältere Browser)
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env', {
                                    targets: '> 0.25%, not dead',
                                    useBuiltIns: 'usage',
                                    corejs: 3
                                }]
                            ]
                        }
                    }
                }
            ]
        },
        
        plugins: [
            // CSS Extraktion für Production
            new MiniCssExtractPlugin({
                filename: isProduction ? 'css/[name].[contenthash:8].css' : 'css/[name].css'
            }),
            
            // Bundle Analyzer (nur wenn --env analyze)
            ...(shouldAnalyze ? [new BundleAnalyzerPlugin()] : [])
        ],
        
        optimization: {
            minimize: isProduction,
            minimizer: [
                // JavaScript Minification
                new TerserPlugin({
                    terserOptions: {
                        compress: {
                            drop_console: isProduction, // Entfernt console.logs in Production
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
                
                // CSS Minification
                new CssMinimizerPlugin()
            ],
            
            // Code Splitting
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    // Vendor Bundle für externe Libraries
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendor',
                        priority: 10
                    },
                    
                    // Common Code zwischen Bundles
                    common: {
                        minChunks: 2,
                        priority: 5,
                        reuseExistingChunk: true,
                        enforce: true
                    }
                }
            },
            
            // Runtime Chunk für besseres Caching
            runtimeChunk: 'single'
        },
        
        // Source Maps für Debugging
        devtool: isProduction ? 'source-map' : 'eval-source-map',
        
        // Performance Hints
        performance: {
            hints: isProduction ? 'warning' : false,
            maxEntrypointSize: 512000, // 500 KB
            maxAssetSize: 512000
        },
        
        // Dev Server Config (falls benötigt)
        devServer: {
            static: {
                directory: path.join(__dirname, './')
            },
            compress: true,
            port: 8080,
            hot: true,
            open: true
        },
        
        // Resolve Config
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
        
        // Stats Output
        stats: {
            colors: true,
            hash: false,
            version: false,
            timings: true,
            assets: true,
            chunks: false,
            modules: false,
            reasons: false,
            children: false,
            source: false,
            errors: true,
            errorDetails: true,
            warnings: true,
            publicPath: false
        }
    };
};
