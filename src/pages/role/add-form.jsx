import React,{Component} from 'react'
import propTypes from 'prop-types'
import {Form,Select,Input} from 'antd'
const Item = Form.Item

/**
 * 路由组件独有的子非路由组件放在它本身的文件夹下
 */

class AddForm extends Component{

     static propTypes={
        setForm:propTypes.func.isRequired,
     } 

     componentWillMount(){
         //徐2：这里调用方法将form传过去了，父组件即可以调用
         this.props.setForm(this.props.form)
     }
     render(){
        const {getFieldDecorator}=this.props.form
        const layout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 15 },
          };
         return(
             <Form>
                 <Item label='角色名称' {...layout}>
                    {getFieldDecorator('roleName',{
                        initialValue:'',
                        rules:[
                             {required:true,message:'角色名称必须输入'}
                         ]})(
                    <Input placeholder="请输入角色名称"/>
                        )}
                    
                </Item>
 
             </Form>

       
         )
     }
 }
export default Form.create()(AddForm)