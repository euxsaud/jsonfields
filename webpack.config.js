// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => {
    const { mode } = argv;
    const isProd = mode === "production";

    return {
        entry: "./src/index.js",
        output: {
            filename: "bundle.js",
            path: path.resolve(__dirname, "dist"),
        },

        devServer: {
            historyApiFallback: true,
            port: 3000,
            hot: false,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        },

        plugins: [
            new CleanWebpackPlugin(),

            new HtmlWebpackPlugin({
                template: "./src/index.html",
            }),

            new MiniCssExtractPlugin(),
        ],

        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                    },
                },
                {
                    test: /\.scss$/,
                    use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
                },
            ],
        },
    };
};
