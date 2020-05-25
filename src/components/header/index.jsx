import React,{Component} from 'react';
import { reqWeather } from '../../api';

import {formateDate} from '../../utils/dateUtils'

import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';
import './index.less'
import { withRouter } from 'react-router-dom';
import menuList from '../../config/menuConfig';
import { Modal } from 'antd';
import LinkButton from '../link-button';
/**
 * 头部的组件
 */
class Header extends Component{


    state={
        currentTime:formateDate(Date.now()),//当前时间字符串
        dayPictureUrl:'',//天气图片url
        weather:'',//天气的文本
        //render()中的显示就是读取这三个中的显示

    }

    getTime=()=>{
        //每隔一秒获取当前时间，并更新状态数据currentTime
       this.intervalId= setInterval(() => {
            const currentTime=formateDate(Date.now())
            this.setState({currentTime})
        }, 1000);
    }

    getWeather=async ()=>{
        //调用接口请求函数获取数据
        const {dayPictureUrl,weather}=await reqWeather('北京')
        //更新状态
        this.setState({dayPictureUrl,weather})

    }

    getTitle=()=>{
        //得到当前请求路径
        const path=this.props.location.pathname
        let title
        menuList.forEach(item=>{
            if(item.key===path){//如果当前item对象的key与path一样，那item的title就是需要显示的title
                title=item.title
            }else if(item.children){
                //在所有子item中查找匹配的
                const cItem=item.children.find(cItem=>path.indexOf(cItem.key)===0)
                //如果有值才说明有匹配的
                if(cItem){
                    //取出title
                    title=cItem.title
                }
            }
        })
        return title
    }
/**
 * 退出登录
 */
    logout=()=>{
        //显示确认框
        Modal.confirm({
            content:'确定退出码',
            onOk:()=>{
                //删除保存的user数据 
                storageUtils.removeUser()
                memoryUtils.user={}
                //跳转到login页面
                this.props.history.replace('/login')
            }
        })
    }
/**
 * 第一次render（）之后执行一次，
 * 一般在此执行异步操作：发Ajax请求/启动定时器
 */
    componentDidMount(){
        //获取当前时间
        this.getTime()
        //获取当前天气显示
        this.getWeather()
    }
/**
 * 当前组件卸载之前调用
 */
    componentWillUnmount(){
        //清除定时器
        clearInterval(this.intervalId)
    }
    render(){

        //先解构出以上三个
        const{currentTime,dayPictureUrl,weather}=this.state
        const username=memoryUtils.user.username
        //得到当前需要显示的title
        const title=this.getTitle()
        return(
            <div className="header">
                <div className="header-top">
                    <span>欢迎，{username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="weather" />
                        <span>{weather}</span>{/**百度地图提供了一个jsonp的接口，如何去发一个jsonp的请求，可以用jsonp的库 */}
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(Header)