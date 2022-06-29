const path = require("path");

let mode = "development";
let devMode = true;
if (process.env.NODE_ENV === "production") {
    mode = "production";
    devMode = false;
}

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

const optimization = function () {
    const config = {
        splitChunks: {
            chunks: "all",
        },
    };

    if (!devMode) {
        config.minimizer = [new TerserWebpackPlugin()];
    }

    return config;
};

const filename = (ext) => (devMode ? `[name].${ext}` : `[name].[contenthash].${ext}`);

module.exports = {
    mode,

    context: path.resolve(__dirname, "src"),

    resolve: {
        extensions: [".js", ".json"],
        alias: {
            "@modules": `${path.resolve(__dirname)}/node_modules`,
        },
    },

    entry: {
        main: "./index.js",
    },

    output: {
        filename: `./js/${filename("js")}`,
        path: path.resolve(__dirname, "dist"),
        assetModuleFilename: "assets/[hash][ext][query]",
        clean: true,
    },

    target: devMode ? "web" : "browserslist",

    devtool: devMode ? "source-map" : false,

    optimization: optimization(),

    devServer: {
        open: {
            app: {
                name: "Google Chrome",
            },
        },
        hot: true,
        port: 8080,
        liveReload: true,
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html",
            minify: {
                collapseWhitespace: !devMode,
            },
        }),
        new MiniCssExtractPlugin({
            filename: `./css/${filename("css")}`,
        }),
    ],

    module: {
        rules: [
            {
                test: /\.html$/i,
                use: "html-loader",
            },
            {
                test: /\.(c|sa|sc)ss$/,
                use: [devMode ? "style-loader" : MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "sass-loader"],
            },
            {
                test: /\.(jpe?g|png|svg)$/,
                type: "asset/resource",
            },
            {
                test: /\.(woff2?|eot|ttf|otf)$/i,
                type: "asset/resource",
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        cacheDirectory: true,
                    },
                },
            },
        ],
    },
};
