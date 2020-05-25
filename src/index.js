/*
 *入口js 
 *在入口js里面渲染App标签
 要渲染必须引入react-dom
  
 */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';//自定义模块需要加点，第三方模块不需要
//import 'antd/dist/antd.css';

import storageUtils from './utils/storageUtils';
import memoryUtils from './utils/memoryUtils';

//读取local(本地)中保存的user，保存到内存中，以后就统一在内存中读就可以了
const user=storageUtils.getUser();
memoryUtils.user=user;

//将App组件标签渲染到index页面的div上
ReactDOM.render(<App />,document.getElementById('root'));