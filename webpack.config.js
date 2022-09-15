const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const production = process.env.NODE_ENV === "production" || false;

module.exports = {
	entry: ["./src/index.ts"], //  <- Modify it to your entry name.
	module: {
		rules: [
			{
				test: /\.ts?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: [".ts", ".js"],
	},
	mode: "production",
	output: {
		filename: production ? "devixel-hmac.min.js" : "devixel-hmac.js",
		path: path.resolve(__dirname, "dist"),
		globalObject: "this",
		library: "devixelHmac",
		libraryExport: "default",
		libraryTarget: "umd",
	},
	optimization: {
		minimize: production,
		minimizer: [new TerserPlugin({})],
	},
};
