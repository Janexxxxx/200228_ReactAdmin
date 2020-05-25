import React,{ Component } from 'react';
//import { Button, message } from 'antd';
import {BrowserRouter,Route,Switch} from 'react-router-dom';
import Login from './pages/login/login';
import Admin from './pages/admin/admin';
/**
 * 应用的根组件
 * 简单定义：函数
 * 复杂定义：类
 * 区别在于有咩有状态
 */

 export default class App extends Component{

 
    render(){
        return(
            <BrowserRouter>
                <Switch>
                    <Route path='/login' component={Login}></Route>{ /**一个前台路由是一个映射关系，有path和component两个属性 */}
                    <Route path='/' component={Admin}></Route>
                </Switch>
            </BrowserRouter>     
        )
    }
 }
 