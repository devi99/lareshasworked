const path = require("path");
//const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
//const copyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
//const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
const ENV = process.argv.find((arg) => arg.includes('prod')) ? 'prod' : process.argv.find((arg) => arg.includes('test')) ? 'test' : 'dev';
const WATCH = process.argv.find((arg) => arg.includes('dev')) ? true : false;
const MODE = process.argv.find((arg) => arg.includes('prod')) ? 'production' : 'development';
const DEVTOOL = process.argv.find((arg) => arg.includes('prod')) ? '' : 'eval-source-map';
const OUTPUT_PATH = ENV === 'prod' ? path.resolve('dist') : path.resolve('src');
const webcomponentsjs = './src/node_modules/@webcomponents/webcomponentsjs';

module.exports = {
    watch: WATCH,
    target: 'web',
    mode: 'development',
    entry: ['babel-polyfill', path.resolve(__dirname, '../index.ts')],
    devtool: 'eval-source-map',
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
        // fallback: { 
        //     "vm": require.resolve("vm-browserify"),
        //     "stream": require.resolve("stream-browserify") 
        // }
    },
    plugins: [
        // new Dotenv({
        //     path: './src/config/.env-' + ENV,
        // }),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            hash: true,
            chunksSortMode: 'auto',
            title: 'EDUAdmin',
            template: './src/indexTemplate.html',
            filename: './index.html',
        }),
        // new copyWebpackPlugin({
        //     patterns: [
        //         { from: './src/assets/img/*', to: './img/[name][ext]' },
        //         { from: './src/assets/img/uiux', to: './img/uiux/[name][ext]' },
        //         { from: './src/assets/css/*', to: './css/[name][ext]' },
        //         { from: './src/assets/favicon.png', to: './favicon.png' },
        //     ],
        // }),            
        // new ServiceWorkerWebpackPlugin({
        //     entry: path.join(__dirname, '../lib/services/service-worker.js'),
        //     excludes: ['**/.*', '**/*.map', '*.html', '*.js'],
        //     filename: 'service-worker.js',
        // }),        
    ],
    output: {
        path: path.resolve(__dirname, '../../public'),
        publicPath: '/', // belangrijk voor het lazy loading van de enrollment stappen (ie personalInfo.js enzo)
        filename: '[name].[hash].bundle.js',
    },
    // node: {
    //     fs: 'empty',
    // },
    module: {
        rules: [
            // {
            //     test: /\.m?js$/,
            //     exclude: /(node_modules|bower_components)/,
            //     use: {
            //         loader: 'babel-loader',
            //         options: {
            //             presets: ['@babel/preset-env'],
            //             plugins: [
            //                 '@babel/plugin-syntax-dynamic-import',
            //                 '@babel/plugin-proposal-class-properties',
            //                 ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
            //             ],
            //         },
            //     },
            // },
            // {
            //     test: /\.css$/i,
            //     use: ['style-loader', 'css-loader', '@teamsupercell/typings-for-css-modules-loader?modules'],
            // },
                  // Handle our workers
            // {
            //     test: /\.worker\.js$/,
            //     use: { loader: "worker-loader" },
            // },
            // {
            //     test: /\.css$/i,
            //     use: [
            //         'style-loader',
            //         '@teamsupercell/typings-for-css-modules-loader',
            //         {
            //         loader: "css-loader",
            //         options: { modules: true }
            //         }
            //     ]
            // },
            {
                test: /\.ts?$/,
                use: [{ loader: 'babel-loader' }, { loader: 'ts-loader' }],
                exclude: /node_modules/,
            },
            {
                test: /\.xs?$/,
                use: 'ignore-loader',
                exclude: /node_modules/,
            },
        ],
    },
};
