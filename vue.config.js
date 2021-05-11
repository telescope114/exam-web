module.exports = {
    css: {
       loaderOptions: {
           scss: {
               prependData: `@import "~@/styles/variables.scss";`
           }
       }
    },
    productionSourceMap: false,
    // devServer: {
    //     // // open: true,
    //     // proxy: {
    //     //     "/api": {
    //     //         target: 'http://172.22.160.33:8080/',
    //     //         ws: true,
    //     //         changeOrigin: true,
    //     //         pathRewrite: {
    //     //             '^/api': ''
    //     //         }
    //     //     }
    //     // }
    // }
}
