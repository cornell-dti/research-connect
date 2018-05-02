const ExtractTextPlugin       = require("extract-text-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const path                    = require("path");
const webpack                 = require("webpack");

const plugins = [
    new ExtractTextPlugin({
        filename: "css/styles.css"
    }),
    new OptimizeCssAssetsPlugin({
        cssProcessorOptions: { discardComments: { removeAll: true } }
    }),
    new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        output: {
            comments: false,
        },
    })
];

module.exports = {
    entry: `./index.js`,
    output: {
        path: `${__dirname}/docs`,
        publicPath: "/",
        filename: "js/bundle.js",
    },
    module: {
        rules: [
            {
                test:    /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["env", "react", "es2015", "stage-2"]
                    }
                }
            },
            {
                test:   /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use:      "css-loader"
                })
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use:      ["css-loader", "less-loader"]
                })
            },
            {
                test: /\.(woff|woff2|eot|ttf)$/,
                use: [
                    {
                        loader: "url-loader?limit=100000",
                        options: {
                            name: "css/[hash].[ext]"
                        }
                    }
                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    {
                        loader: "file-loader?limit=100000",
                        options: {
                            name: "img/[hash].[ext]"
                        }
                    },
                    "img-loader"
                ]
            },
            {
                test: /\.(ico|pdf)$/i,
                use: [
                    "file-loader?name=./img/[name].[ext]"
                ]
            }
        ],
    },
    plugins: plugins
};
