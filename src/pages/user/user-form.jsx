import React,{Component} from 'react'
import propTypes from 'prop-types'
import {Form,Select,Input} from 'antd'
const Item = Form.Item
const Option=Select.Option 

/**
 * 路由组件独有的子非路由组件放在它本身的文件夹下
 */

class UserForm extends Component{

     static propTypes={
        setForm:propTypes.func.isRequired,
        roles:propTypes.array.isRequired,
        user:propTypes.object
     } 

     componentWillMount(){
         //徐2：这里调用方法将form传过去了，父组件即可以调用
         this.props.setForm(this.props.form)
     }
     render(){
        const {getFieldDecorator}=this.props.form
        const {roles}=this.props
        const user=this.props.user||{}
        const layout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 15 },
          };
         return(
             <Form {...layout}>
                 <Item label='用户名' >
                    {getFieldDecorator('username',{
                        initialValue:user.username,
                        rules:[
                             {required:true,message:'用户名必须输入'}
                         ]})(
                         <Input placeholder="请输入用户名"/>
                        )}
                    
                </Item>
               
               {
                   user._id?null:(
                    <Item label='密码'>
                    {getFieldDecorator('password',{
                        initialValue:user.password,
                        rules:[
                             {required:true,message:'密码必须输入'}
                         ]})(
                         <Input type='password' placeholder="请输入密码"/>
                        )}
                    
                </Item>
                   )
               }
                <Item label='手机号'>
                    {getFieldDecorator('phone',{
                        initialValue:user.phone,
                        rules:[
                             {required:true,message:'手机号必须输入'}
                         ]})(
                         <Input placeholder="请输入手机号"/>
                        )}
                    
                </Item>
                <Item label='邮箱'>
                    {getFieldDecorator('email',{
                        initialValue:user.email,
                        rules:[
                             {required:true,message:'邮箱必须输入'}
                         ]})(
                         <Input placeholder="请输入邮箱"/>
                        )}
                    
                </Item>
                <Item label='角色'>
                    {getFieldDecorator('role_id',{
                        initialValue:user.role_id,
                        })(
                            <Select>
                                {roles.map(role=> <Option key={role._id} value={role._id}>{role.name}</Option>)}
                            </Select>   
                        )}
                      
                </Item> 
             </Form>

       
         )
     }
 }
export default Form.create()(UserForm)