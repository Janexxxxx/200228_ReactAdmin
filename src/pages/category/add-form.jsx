import React,{Component} from 'react'
import propTypes from 'prop-types'
import {Form,Select,Input} from 'antd'
const Item = Form.Item
const Option=Select.Option
/**
 * 路由组件独有的子非路由组件放在它本身的文件夹下
 */

class AddForm extends Component{

     static propTypes={
        setForm:propTypes.func.isRequired,
        categorys:propTypes.array.isRequired,//一级分类的数组
        parentId:propTypes.string.isRequired,//父分类的ID
     } 

     componentWillMount(){
         this.props.setForm(this.props.form)
     }
     render(){
        const {categorys,parentId}=this.props 
        console.log('categorys:'+categorys)
        console.log('parentId:'+parentId)
        const {getFieldDecorator}=this.props.form
         
         return(
             <Form>
                 <Item>
                     {
                         getFieldDecorator('parentId',{initialValue:parentId,})
                         (<Select>
                            <Option value='0'>一级分类</Option>
                            {
                               
                               categorys.map(c=><Option value={c._id}>{c.name}</Option>)
                            }
                         </Select>)
                     }
                     
                 </Item>
                 <Item>
                    {getFieldDecorator('categoryName',{initialValue:'',rules:[
                             {required:true,message:'分类名称必须输入'}
                         ]})(
                    <Input placeholder="请输入分类名称"/>
                        )}
                    
                </Item>
             </Form>

       
         )
     }
 }
export default Form.create()(AddForm)

