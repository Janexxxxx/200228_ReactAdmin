import React,{Component} from 'react';
import logo from '../../assets/images/logo.png';
import {Link,withRouter} from 'react-router-dom';
import { Menu, Icon } from 'antd';
import './index.less';
import menuList from '../../config/menuConfig';//默认暴露的这里可以起任意的名字，最好见名知意
import memoryUtils from '../../utils/memoryUtils'
const SubMenu=Menu.SubMenu;
/**
 * 左侧导航的组件
 */
class LeftNav extends Component{


    /**
     * 判断当前登录用户对item是否有权限
     */
    hasAuth=(item)=>{
        //item中有key
        //当前登录的用户应该有一个menus
        const {key,isPublic}=item
        const menus=memoryUtils.user.role.menus
        const username=memoryUtils.user.username
        /**
         * 1、如果当前用户是admin
         * 2、如果当前item是公开的
         * 3、当前用户有次item的权限：key有没有在menus中
         */

         if(username==='admin' || isPublic || menus.indexOf(key)!==-1){
             return true
         }else if(item.children){//4、如果当前用户有此item的某个子item的权限
            return !!item.children.find(child=>menus.indexOf(child.key)!==-1)
         }     
            return false
    }
    /**
     * 根据menu的数据数组生成对应的标签数组(如：Menu.Item/SubMenu)
     * 
     * 使用map()+递归调用
     */
    getMenuNodes_map=(menuList)=>{
        return menuList.map(item =>{
            /**
             * {
                title: '首页', // 菜单标题名称
                key: '/home', // 对应的path
                icon: 'home', // 图标名称
                children:[],//可能有，也可能没有
                }

                返回标签结构
             */
            if(!item.children){
                return (
                    <Menu.Item key={item.key}>{/**需要保证每一个key都不相同，所以可以使用连接作为key*/} 
                    <Link to ={item.key}>
                        <Icon type={item.icon}/>
                        <span>{item.title}</span>
                    </Link>                        
                    </Menu.Item>
                )
            }else{
                return(
                    <SubMenu
                        key={item.key}
                        title={
                        <span>
                        
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                                                  
                        </span>
                        }
                    >   
                    {/**这里采用递归调用 */}
                    {this.getMenuNodes(item.children)}
                    </SubMenu>
                )
            }
           

        })
    }
    getMenuNodes=(menuList)=>{

        const path=this.props.location.pathname;
        return menuList.reduce((pre,item)=>{

            if(this.hasAuth(item)){
                //向pre添加<Menu.item>
                if(!item.children){
                    pre.push((
                        <Menu.Item key={item.key}>{/**需要保证每一个key都不相同，所以可以使用连接作为key*/} 
                            <Link to ={item.key}>
                                <Icon type={item.icon}/>
                                <span>{item.title}</span>
                            </Link>                        
                        </Menu.Item>

                    ))

                }else{
                    //查找一个与当前请求路径匹配的子Item
                    const cItem = item.children.find(cItem=>path.indexOf(cItem.key)===0)
                    if(cItem){
                        //如果存在，说明当前item的子列表需要展开
                        this.openKey=item.key//相当于往this里面存了一个openKey，到时候可以往this里面取，this是主键对象
                    }


                    //向pre添加<SubMenu>
                    pre.push((
                        <SubMenu
                            key={item.key}
                            title={
                            <span>
                            
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                                                    
                            </span>
                            }
                        // defaultSelectedKeys={[path]}
                        >   
                        {/**这里采用递归调用 */}
                        {this.getMenuNodes(item.children)}
                        </SubMenu>
                    ))
                }
            }            
            return pre
        },[])
    }
    //路由组件的三大属性：location/history/match,由于index.jsx不是路由组件，故没有这些属性
    
    //在第一次render()之前执行一次
    //为第一个render()准备数据(必须是同步的)
    componentWillMount(){
        this.menuNodes=this.getMenuNodes(menuList)
    }

    render(){
        //const menuNodes=this.getMenuNodes(menuList)
        let path=this.props.location.pathname;
        console.log('render()',path)
        if(path.indexOf('/product')===0){
            path='/product'
        }
        const openKey=this.openKey
        return(
            <div  className="left-nav">
                <Link to='/' className="left-nav-header">
                    <img src={logo} alt="logo"/>
                    <h1>React后台</h1>
                </Link>
                <Menu
                    mode="inline"
                    theme="dark"
                    selectedKeys={[path]}//保持刷新自动还在当前项，但有一个问题，子列表无法展开，
                    defaultOpenKeys={[openKey]}//在朝找并添加子节点那一块添加代码 

                    //还有一个问题：要动态确定并打开当前选中的子列表
                >
                    {/* <Menu.Item key="/home">
                        <Link to ='/home'>
                            <Icon type="pie-chart" />
                            <span>首页</span>
                        </Link>                        
                        </Menu.Item>
                   
                    <SubMenu
                        key="sub1"
                        title={
                        <span>
                        
                            <Icon type="mail" />
                            <span>商品</span>
                                                  
                        </span>
                        }
                    >
                        <Menu.Item key="/category">
                            <Link to='/category'>
                                <Icon type="mail" />
                                <span>品类管理</span>
                            </Link>  
                        </Menu.Item>
                        <Menu.Item key="/product">
                            <Link to='/product'>
                                <Icon type="mail" />
                                <span>商品管理</span>
                            </Link>

                        </Menu.Item>
                        
                    </SubMenu>
                    <Menu.Item key="/user">
                            <Link to='/user'>
                                <Icon type="mail" />
                                <span>用户管理</span>
                            </Link>  
                        </Menu.Item>
                        <Menu.Item key="/role">
                            <Link to='/role'>
                                <Icon type="mail" />
                                <span>角色管理</span>
                            </Link>

                        </Menu.Item> */}

                    {
                        this.menuNodes//获取menu的所有子节点，，返回一个数组
                    }    
                    
                </Menu>
            </div>
        )
    }
}
/**
 * withRouter高阶组件
 * 包装非路由组件，返回一个新的组件
 * 新的组件向非路由组件传递3个属性：history/locatio/match
 */
export default withRouter (LeftNav)