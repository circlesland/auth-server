const path = require('path')
const webpack = require('webpack')
const package = require('./package.json')

module.exports = {
    entry: './src/client.ts',
    mode: 'production',
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        })
    ],
    resolve: {
        fallback: {
            "buffer": require.resolve("buffer/"),
            "crypto": require.resolve("crypto-browserify"),
            "util": require.resolve("util/"),
            "stream": require.resolve("stream-browserify/")
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    },
    output: {
        path: path.resolve('dist'),
        filename: 'client-' + package.version + '.bundle.js',
        library: 'circlesland_auth'
    }
}