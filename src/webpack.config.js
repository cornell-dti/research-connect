const ExtractTextPlugin       = require("extract-text-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const path = require("path");

const plugins = [
    new ExtractTextPlugin({
        filename: "css/styles.css"
    }),
    new OptimizeCssAssetsPlugin({
        cssProcessorOptions: { discardComments: { removeAll: true } }
    })
];

module.exports = {
    entry: "./index.js",
    output: {
        path: `${__dirname}/docs`,
        publicPath: "/",
        filename: "js/bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["env", "react", "es2015", "stage-2"]
                    }
                }
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: "file-loader?limit=100000&name=./img/[hash].[ext]",
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use:      ["css-loader"]
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
                loader: "url-loader?limit=100000&name=./fonts/[hash].[ext]"
            },
        ]
    },
    plugins: plugins
};
