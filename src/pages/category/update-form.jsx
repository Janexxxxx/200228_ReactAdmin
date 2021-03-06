import React,{Component} from 'react'
import propTypes from 'prop-types'
import {Form,Input} from 'antd'
const Item = Form.Item

/**
 * 路由组件独有的子非路由组件放在它本身的文件夹下
 */

class UpdateForm extends Component{
    static propTypes={
        categoryName:propTypes.string.isRequired,
        setForm:propTypes.func.isRequired
    }

    componentWillMount(){
        //将form对象通过setForm()传递给父组件
        this.props.setForm(this.props.form)
    }
     render(){
         const {categoryName}=this.props
         const {getFieldDecorator}=this.props.form
         return(
             <Form>
                
                 <Item>
                    {getFieldDecorator('categoryName',{initialValue:categoryName,rules:[
                             {required:true,message:'分类名称必须输入'}
                         ]})(
                    <Input placeholder="请输入分类名称"/>
                        )}
                    
                </Item>
             </Form>

       
         )
     }
 }
export default Form.create()(UpdateForm)

