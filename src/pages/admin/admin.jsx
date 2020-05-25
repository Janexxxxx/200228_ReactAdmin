import React,{Component} from 'react';
import memoryUtils from '../../utils/memoryUtils';
import { Redirect,Route,Switch } from 'react-router-dom';
import { Layout } from 'antd';//antd组件，Layout组件，Header...组件
import LeftNav from '../../components/left-nav';//index.jsx,则只要引入到文件夹这里就够了
import Header from '../../components/header';


//路由组件先全部定义好，下一步是将路由组件映射成路由，路由组件在admin.jsx里面显示，所以就在admin.jsx里面映射
import Home from '../home/home';
import Category from '../category/category';
import Product from '../product/product';
import Role from '../role/role';
import User from '../user/user';
import Bar from '../charts/bar';
import Pie from '../charts/pie';
import Line from '../charts/line';

const { Footer, Sider, Content } = Layout;
/**
 * 后台管理的路由组件 
 */
export default class Admin extends Component{
    render(){

        //步骤：首先输入用户信息，调用登陆的接口请求，如果请求成功，九江user保存到local/内存中去，跳转到admin，然后在src/index.js中读取(get)local中user到内存中保存
        //再在admin.jsx中判断如果内存中没有user，自动跳转到login
        const user=memoryUtils.user;//这里不一定就有数据
        //如果内存中没有存储user==>代表当前没有登录
        if(!user ||!user._id){
            //在render()中自动跳转到登录
            return <Redirect to='/login' />//同时出现的问题，已经登陆上去再帅新会调回主页面，故需要维持登录，所以不能将user放到内存中，因为一刷新就没了
                                            //应该放在一个关掉浏览器，或者刷新都不影响的地方
        }
        return(

            <Layout style={{minHeight:'100%'}}>
                <Sider>
                    <LeftNav/>
                </Sider>
                <Layout>
                    <Header>Header</Header>
                    <Content style={{margin:20,backgroundColor:'#fff'}}>
                        <Switch>
                            <Route path='/home' component={Home}/>
                            <Route path='/category' component={Category}/>
                            <Route path='/product' component={Product}/>
                            <Route path='/role' component={Role}/>
                            <Route path='/user' component={User}/>
                            <Route path='/charts/bar' component={Bar}/>
                            <Route path='/charts/line' component={Line}/>
                            <Route path='/charts/pie' component={Pie}/>
                            <Redirect to='/home'/>{/**注意随时保存 */}
                        </Switch>
                    </Content>{/*两个大括号，外面的表示是js代码，里面表示是js对象*/}
                    <Footer style={{textAlign:'center',color:'#cccccc'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
                </Layout>
            </Layout>
           
        )
    }
}