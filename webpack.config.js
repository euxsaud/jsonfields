// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = (env, argv) => {
    const { mode } = argv;
    const isProd = mode === "production";

    return {
        entry: "./src/index.js",
        output: {
            filename: "bundle.js",
            path: path.resolve(__dirname, "dist"),
            publicPath: "/",
        },

        devServer: {
            contentBase: path.resolve(__dirname, "dist"),
            compress: true,
            port: 3000,
            open: true,
            hot: false,
        },

        plugins: [
            new CleanWebpackPlugin(),

            new HtmlWebpackPlugin({
                template: "./src/index.html",
            }),
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
                    use: ["style-loader", "css-loader", "sass-loader"],
                },
            ],
        },
    };
};
