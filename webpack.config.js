const { join } = require("path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

function defineDevtool(buildTime) {
    switch (buildTime) {
        case "fastest":
            return "eval";
        case "fast":
            return "cheap-module-eval-source-map";
        default:
            return "source-map";
    }
}
// @daniel: devtool configurations: "slow", "fast", "fastest" build time optimization
const devtool = defineDevtool("slow");
// @daniel: define configurations mostly for development bundles, there are configurations for production when neccessary
const config = {
    entry: {
        // @daniel: do not separate single entry point for /\.s?css$/ files, it will create bugs in production build
        student_app: ["./src/student_app/boot.ts", "./src/css/app.scss"],
        teacher_app: "./src/teacher_app/boot.ts",
    },
    output: {
        filename: "app/[name]/bundle.js",
        // @daniel: setting for easier debugging in development
        pathinfo: true,
    },
    devtool,
    resolve: {
        extensions: [".ts", ".tsx", ".css", ".scss", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                include: join(__dirname, "src"),
                use: "ts-loader", // consider migrating to awesome-typescript-loader for better bundling performance
            },
            {
                test: /\.s?css$/,
                include: join(__dirname, "src"),
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{ loader: "css-loader", options: { sourceMap: devtool === "source-map", importLoaders: 1 } }, "sass-loader"],
                }),
            },
        ],
    },
    // @daniel: in order to ignore all (except lodash, rxjs, md-color-picker) modules in node_modules folder
    externals: [nodeExternals({ importType: "var", whitelist: [/^lodash/, /^rxjs/] })],
    plugins: [
        new CopyWebpackPlugin([{ context: "./src", from: "**/*.html", to: "./app" }], { copyUnmodified: false }),
        // @daniel: omitted postcss-loader because it is unnecessary when combining with sass-loader, and is inferior to OptimizeCssAssetsPlugin
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require("cssnano"),
            cssProcessorOptions: { discardComments: { removeAll: true } },
            canPrint: true,
        }),
        // @daniel: must put at the end of the list in order to execute before optimization
        new ExtractTextPlugin({ filename: "app/css/bundle.css", allChunks: true }),
    ],
};

// @daniel: below are the build configurations for production shipping bundles
/* reserved for production build */

module.exports = config;
