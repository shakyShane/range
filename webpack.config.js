module.exports = {
    entry: ['./src/main'],
    output: {
        path: require('path').join(__dirname, 'app'),
        filename: 'dist/bundle.js'
    },
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                test: /\.jsx?$/,
                exclude: /node_modules/,
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
};
