const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: ['webpack/hot/poll?100', './src/index.ts'],
    target: 'node',
    externals: [
        nodeExternals({
            allowlist: ['webpack/hot/poll?100']
        })
    ],
    module: {
        rules: [
            {
                test: /.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(ts|tsx)$/,
                enforce: 'pre',
                use: [
                    {
                        options: {
                            eslintPath: require.resolve('eslint'),
            
                        },
                        loader: require.resolve('eslint-loader'),
                    },
                ],
                exclude: /node_modules/,
            }
        ]
    },
    mode: process.env.NODE_ENV,
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    plugins: [new webpack.HotModuleReplacementPlugin()],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'index.js'
    }
};