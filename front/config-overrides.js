// const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = function override(config) {
    // config.output.publicPath = process.env.WEBPACK_PUBLIC_PATH
    // config.plugins.push(
    //     new ModuleFederationPlugin({
            // name: 'biotropikaChat',
            // filename: 'remoteEntry.js',
            // exposes: {
            //     './Chat': './src/components/Chat/Chat',
            // },
            // shared: ['react', 'react-dom']
        // }),
    // )
    return config;
}