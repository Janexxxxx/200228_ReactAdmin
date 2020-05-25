import React,{Component} from 'react';
import{Form,Icon,Input,Button,message} from 'antd';


import './login.less';/**边写结构，边写样式 */
import logo from '../../assets/images/logo.png';
import {reqLogin} from '../../api';//默认暴露的时候不要写大括号，分别暴露就需要写
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';
import { Redirect } from 'react-router-dom';
/**
 * 登录的路由组件，一级路由
 */
class Login extends Component{ 

    handleSubmit=(event)=>{
        //防止自动提交
        event.preventDefault();

        this.props.form.validateFields(async (err, values) => {
            //校验成功
            if (!err) {
              //console.log('提交登录的Ajax请求 ', values);
              //请求登录 
              const{username,password}=values;  //这些名字最好都一致，避免出错
              //try{
              const result=await reqLogin(username,password);//原本返回的是promise对象，但我想要的是成功的时候异步的response，response.data
                                                            //{status:0,data:user}
                if(result.status===0){//登录成功
                    //提示登录成功
                    message.success('登录成功');

                    const user=result.data;
                    memoryUtils.user=user;//这里只是保存到内存中
                    storageUtils.saveUser(user);//保存到local中


                    //跳转到管理界面,push/replace(不需要再回退到登录界面)/goback
                    this.props.history.replace('/');
                }else{//登录失败
                    message.error(result.msg);
                }
              //}catch(error){
                //  alert('请求出错了:',error.message);
              //}
              
            }else{
                console.log('校验失败！');
            }
          });
        //得到form对象
        //const form=this.props.form;
        //获取表单项的输入数据
      //  const values=form.getFieldsValue();
      //  console.log(values);
    }
    /**
     * 对密码进行自定义验证
     */
    validatePwd=(rule,value,callback)=>{
                               /*
                                用户名/密码的的合法性要求
                                1). 必须输入
                                2). 必须大于4 位
                                3). 必须小于12 位
                                4). 必须是英文、数组或下划线组成
                                */
        if(!value){
            callback('密码必须输入')
        }else if(value.length<4){
            callback('密码长度不能小于4位')
        } else if(value.length>12){
            callback('密码长度不能大于12位')
        }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
            callback('密码必须是英文、数字或下划线组成')
        }else{
            callback()
        }
        //要求callback函数必须使用
        //callback()//验证通过
        //callback('xxxx')//验证失败，并指定提示的文本
    }
    render(){

        //如果用户已经登录，自动跳转到管理界面
        const user=memoryUtils.user;
        if(user&&user._id){
            return <Redirect to ='/' />
        }


        //得到具强大功能的form对象
        const form = this.props.form;
        const{getFieldDecorator}=form;
        return(
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo" />
                    <h1>React项目：后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户登录</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {
                                /*
                                用户名/密码的的合法性要求
                                1). 必须输入
                                2). 必须大于4 位
                                3). 必须小于12 位
                                4). 必须是英文、数组或下划线组成
                                */
                            }
                            {getFieldDecorator('username',{
                                //声明式验证：直接使用别人定义好的验证规则进行验证  
                                rules:[
                                    {required:true,whitespace:true,message:'用户必须输入'},
                                    {min:4,message:'用户名至少四位'},
                                    {max:12,message:'用户名最多12位'},
                                    {pattern:/^[a-zA-Z0-9_]+$/,message:'用户名必须是英文、数组或下划线组成'},
                                ],initialValue:'admin'//配置的作用是指定初始值
                            })(<Input
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}//prefix带有前缀图标的input，
                                        //其属性可以是ReactNode，即可以是标签形式，icon标签有type等属性，同样可以通过查询文档得知
                            placeholder="Username"
                            />,
                            )}
                            
                        
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password',{
                                rules:[
                                    {
                                        validator:this.validatePwd//这个方法用来验证password的值
                                    }
                                ]
                            })(
                                  <Input
                                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                  type="password"
                                  placeholder="Password"
                                  />
                            )}
                          
                        
                        </Form.Item>
                        <Form.Item>
                        
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            登录
                        </Button>
                        
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}

const WrapLogin = Form.create()(Login);
export default WrapLogin
/**
 * 高阶函数与高阶组件
 * 组件是类型，标签对象是组件的一个实例，高阶组件是对组件这个类型进行包装
 */
/**
 * 1、前台表单验证
 * 2、收集表单验证数据
 */
/**
 * async和await
 * 1、作用？
 *  简化了promise对象的使用：不用再使用.then()来指定成功/失败的回调函数
 *  以同步编码（即没有回调函数了）方式实现异步流程
 * 2、哪里写await？
 *  在返回promise的表达式左侧写await：原因是不想要promise，想要promise异步执行成功的value数据。
 * 3、哪里写async? 
 *  await所在函数(最近的)定义的左侧写async
 */