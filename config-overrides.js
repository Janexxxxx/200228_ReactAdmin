//只需打包引入组件的相关样式，比如这里只需要antd组件的button按钮样式即可


//针对antd组件库实现按需打包，即根据import来打包（使用babel-plugin-import,在package.json中存在，所以已经下载过了，前面的babel-plugin-省略）


const {override, fixBabelImports, addLessLoader} = require('customize-cra');
module.exports = override(
fixBabelImports('import', {
libraryName: 'antd',
libraryDirectory: 'es',
style: true,//自动打包引入组件的相关样式
}),

//添加lessLoader，处理less源码文件，less文件编译后才变成css文件
//@primary-color，以@开头，实际上是指定了一个变量名，这里意思是改变主体颜色使它变成绿色
addLessLoader({
javascriptEnabled: true,
modifyVars: {'@primary-color': '#1DA57A'},
}),
);