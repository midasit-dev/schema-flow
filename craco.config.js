const path = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const tsConfigPath = path.resolve(__dirname, "./tsconfig.json");

module.exports = {
	webpack: {
		configure: (webpackConfig, { env, paths }) => {
			webpackConfig.resolve.plugins.push(
				new TsconfigPathsPlugin({
					configFile: tsConfigPath,
					extensions: [".js", ".jsx", ".ts", ".tsx"],
				})
			);
	
			webpackConfig.module.rules.push({
				test: /\.(ts|js|tsx|jsx)$/,
				exclude : { and: [ /node_modules/, /^((?!@midas).)*$/ ] },
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env", "@babel/preset-typescript", ["@babel/preset-react", {"runtime": "automatic"}]],
						plugins: [
							[ "@babel/plugin-proposal-decorators", { "version": "2023-05" } ]
						]
					}
				}
			})
			
			if (process.env.NODE_ENV === "production") webpackConfig.devtool = false;
	
			webpackConfig.optimization.runtimeChunk = "single";
			webpackConfig.optimization.splitChunks = {
				chunks: "all",
				maxInitialRequests: Infinity,
				cacheGroups: {
					app: {
						test: /.[\\/]src[\\/]/,
						name: process.env.REACT_APP_CONTENT_NAME,
						reuseExistingChunk: true,
						enforce: true,
					},
				},
			};
			webpackConfig.output.filename = "static/js/[name].[contenthash].js";
			webpackConfig.output.chunkFilename = "static/js/[name].[contenthash].js";
			return webpackConfig;
		},
	},
	devServer: (devSeverConfig, { env, paths, proxy, allowedHost }) => {
		devSeverConfig.proxy = {
			"/backend": {
				target: process.env.REACT_APP_ACTUAL_API_URL,
				changeOrigin: true,
				secure: false,
			},
		};
		devSeverConfig.allowedHosts = ['moa.rpm.kr-dv-midasit.com', "localhost"];

		if (process.env.HTTPS === "true") {
			const fs = require("fs");
			devSeverConfig.https = {
				key: fs.readFileSync(
					path.resolve(__dirname, process.env.REACT_HTTPS_KEY),
					"utf8"
				),
				cert: fs.readFileSync(
					path.resolve(__dirname, process.env.REACT_HTTPS_CERT),
					"utf8"
				),
				ca: fs.readFileSync(
					path.resolve(__dirname, process.env.REACT_HTTPS_CA),
					"utf8"
				),
			};
		}
		
		return devSeverConfig;
	},
};
