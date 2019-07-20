/**
 * @author Nickyzhang
 * @date 2019/7/7
 * @description file templates
 */
const webpack = require("webpack");

module.exports = {
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'window.jQuery': 'jquery',
                Popper: ['popper.js', 'default']
            })
        ]
    }
}
