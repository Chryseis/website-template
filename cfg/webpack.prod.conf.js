/**
 * Created by Administrator on 2017/11/19.
 */
const path = require('path');
const fs = require('fs');
const merge = require('webpack-merge');
const webpack = require('webpack');
const baseWebpackConfig = require('./webpack.base.conf');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

let entry = {};

let htmlPlugin = [];

let entryDirArr = fs.readdirSync(path.resolve(__dirname, '../src')).filter((dir) => dir !== 'components');

entryDirArr.forEach((dir, i) => {
    entry[dir] = [path.resolve(__dirname, '../src', `${dir}/${dir}.js`), path.resolve(__dirname, '../common/css/reset.css')];
});

Object.keys(entry).forEach((key, i) => {
    htmlPlugin.push(new HtmlWebpackPlugin({
        filename: `${key}.html`,
        template: path.resolve(__dirname, '../template', `${key}.html`),
        chunks: ['components',`${key}`]
    }))
})

entry['components'] = path.resolve(__dirname, '../src/components/components.less');

module.exports = merge(baseWebpackConfig, {
    entry,
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/',
        filename: 'js/[name].js',
        sourceMapFilename: '[file].map'
    },
    devtool:'source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }), new ExtractTextPlugin({
            filename: 'css/[name].css',
            allChunks: true
        }),
        new webpack.ProvidePlugin({
            "$": "jquery"
        }),
        new UglifyJSPlugin({
            compress: {
                warnings: true
            },
            sourceMap: true
        })].concat(htmlPlugin)
})