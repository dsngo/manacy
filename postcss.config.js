// module.exports = {
//     plugins: [
//         require('postcss-easy-import'),
//         require('postcss-nested'),
//         // require('precss'),
//         require('autoprefixer')({
//             browsers: ['last 2 versions', '> 2%']
//         }),
//         //   require('postcss-media-minmax'),
//         require('cssnano'),
//     ]
// }

module.exports = {
    plugins: {
        'postcss-easy-import': { extensions: ['.css', '.scss'] },
        'postcss-nested': {},
        'autoprefixer': {
            browsers: ['last 2 versions', '> 2%'],
        },
        'cssnano': { preset: 'default' },
    },
};