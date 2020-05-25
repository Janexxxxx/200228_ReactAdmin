import React,{Component} from 'react';
import { Button,Card, Table,Modal, message} from 'antd';
import {PAGE_SIZE} from '../../utils/constants'
import LinkButton from '../../components/link-button';
import {reqUsers,reqDeleteUser,reqAddUser,reqAddOrUpdateUser} from '../../api/index'
import {formateDate} from '../../utils/dateUtils'
import UserForm from './user-form'

const {confirm} = Modal
/**
 * 用户路由
 */

 export default class User extends Component{
     state={
         isShow:false,
         users:[],
         roles:[],
     }

     initColumns=()=>{
         this.columns=[
             {
                 title:'用户名',
                 dataIndex:'username'
             },
             {
                title:'邮箱',
                dataIndex:'email'
            },
            {
                title:'电话',
                dataIndex:'phone'
            },
            {
                title:'注册时间',
                dataIndex:'create_time',
                render:formateDate
            },
            {
                title:'所属角色',
                dataIndex:'role_id',
                render:(role_id)=>this.state.roles.find(role=>role._id===role_id).name
            },
            {
                title:'操作',
                render:(user)=>(
                    <span>
                        <LinkButton onClick={()=>this.showUpdate(user)}>修改</LinkButton>
                        <LinkButton onClick={()=>this.confirmDelete(user)}>删除</LinkButton>
                    </span>
                )
                
                     
            },
         ]
     }

     showUpdate=(user)=>{
        this.user=user//保存user
        
        
        this.setState({
            isShow:true
        })
     }
     confirmDelete=(user)=>{ 
        console.log('uuuuuser',user);      
        confirm({
            
            title: `确定删除${user.username}吗？`,
            onOk:async ()=> {
            //   console.log('OK');
            const result=await reqDeleteUser(user._id)
            if(result.status===0){
                message.success('删除用户成功！')
                this.getUsers()
            }
            } 
          });
     }

     getUsers=async()=>{
        const result=await reqUsers()
        if(result.status===0){
            const {users,roles}=result.data   
            //console.log(users);
             this.setState({
                 users,
                 roles
             }) 
        }
       
     }

     addorUpdateUser = async () => {
         this.setState({
            isShow:false
         })
         const user=this.form.getFieldsValue()
         console.log('user',user);
         this.form.resetFields()
         if(this.user){
             user._id=this.user._id
         }

         const result=await reqAddOrUpdateUser(user)
         console.log('result',result); 
         if(result.status===0){
             message.success(`${this.user?'修改':'添加'}用户成功`)
             this.getUsers()
         }
     }
     componentWillMount(){
         this.initColumns()
     }

      componentDidMount(){
         this.getUsers()         
     }
     render(){
         const user=this.user
         const {users,isShow,roles}=this.state
         const title=<Button type='primary' onClick={()=>{
            this.user=null 
            this.setState({isShow:true})}}>创建用户</Button>
         return(
             <Card title={title}>
                 <Table
                    bordered
                    rowKey='_id'
                    columns={this.columns}
                    dataSource={users}
                    pagination={{defaultPageSize:PAGE_SIZE}}
                 />
                 <Modal
                    title={user?'修改用户':'添加用户'}
                    visible={isShow}//状态为1时可视化
                    onOk={this.addorUpdateUser}//添加分类的事件函数
                    onCancel={()=>{
                        this.form.resetFields()
                        this.setState({isShow:false})}}
                    >
                        {/*徐1： 我们需要传一个setForm过去，传的是一个函数类型的属性，且该函数是用来接收form的，所以要把接收到的form存起来用this.form */}
                    <UserForm 
                    setForm={(form)=>{this.form=form}}
                    roles={roles}
                    user={user}
                    />             
                </Modal>
             </Card>
       
         )
     }
 }