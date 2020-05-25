import React,{Component} from 'react';
import {Card,Button,Table,Modal, message} from 'antd'
import {PAGE_SIZE} from '../../utils/constants'
import {reqRoles,reqAddRole,reqUpdateRole} from '../../api/index'
import AddForm from './add-form'
import AddAuth from './add-auth'
import memoryUtils from '../../utils/memoryUtils'
import { formateDate } from '../../utils/dateUtils';
import storageUtils from '../../utils/storageUtils'
/**
 * 角色路由
 */

 export default class Role extends Component{

    state = {
      roles:[],//所有角色的列表
      role:{},//选中的role
      isShowAdd:false,//是否显示添加页面
      isShowAuth:false,
      }


      constructor(props){
          super(props)
          this.autH=React.createRef()
      }

     initColumn=()=>{
         this.columns=[
             {
                 title:'角色名称',
                 dataIndex:'name'

             },
             {
                title:'创建时间',
                dataIndex:'create_time',
                render:(create_time)=>formateDate(create_time)
             },
             {
                title:'授权时间',
                dataIndex:'auth_time',
                render:formateDate
             },
             {
                title:'授权人',
                dataIndex:'auth_name'
             },
         ]
     }


     //第一步先获取后台整体数据
     getRoles=async ()=>{
         const result=await reqRoles()
         if(result.status===0){
            const roles= result.data
            this.setState({
                roles
            })
         }
     }


     onRow=(role)=>{
                 
         return{
            onClick:event=>{
                console.log('role',role);
               // alert('点击行')
               this.setState({
                   role
               })
            }
         }
         
     }
     

     /**
      * //第二步再添加步骤
      * 添加角色
      */
     addRole=()=>{
         //表单验证
         this.form.validateFields(async(error,values)=>{
             if(!error){
                 this.setState({
                     isShowAdd:false
                 })
                //收集输入数据
                const {roleName}=values
                this.form.resetFields()
                //请求
                const result=await reqAddRole(roleName)
                if(result.status===0){
                    //更新
                    message.success('添加角色成功')
                    //提供三种方法获取新的页面
                    //法1：
                    //this.getRoles()
                    const role=result.data
                    //法2：
                   /* const roles=[...this.state.roles]
                    roles.push(role)
                    this.setState({
                        roles
                    })*/

                    //法3：
                    //更新roles状态：函数形式基于原本状态数据更新
                    //若是直接替换掉原状态则可以直接使用对象模式
                    this.setState(state=>({
                        roles:[...state.roles,role]
                    }))

                }else{
                    message.error('添加角色失败')
                }
                
             }
         })
         

     }

     /**
      * 更新角色
      */
     updateRole=async()=>{
         //获取原状态
         //获取数据/获取新状态
         //更新新状态
         //发送请求
         this.setState({
             isShowAuth:false
         })
        const role=this.state.role //这里的role和addauth里的不一样了，因为menu变了，而这里并未获得
        const menus=this.autH.current.getAuth()//所以这一步主要是为了获取新的menus
        role.menus=menus
        role.auth_time=Date.now()
        role.auth_name=memoryUtils.user.username
        const result=await reqUpdateRole(role)
        if(result.status===0){
            
            //this.getRoles()
            //如果当前更新的是自己角色的权限，强制退出
            if(role._id===memoryUtils.user.role_id){
                memoryUtils.user={}
                storageUtils.removeUser()
                this.props.history.replace('/login')
                message.success('当前用户角色权限修改了，请重新登陆')
            }else{
                message.success('设置角色成功')
                this.setState({
                    roles:[...this.state.roles]
                })
            }
          
        }

     }


     componentWillMount(){
         this.initColumn()
     }
     componentDidMount(){
         this.getRoles()
     }
     render(){
       
        const {roles,role,isShowAdd,isShowAuth}=this.state
        const title=(
            <span>
                <Button type='primary' onClick={()=>this.setState({isShowAdd:true})}>创建角色</Button>&nbsp;&nbsp;
                <Button type='primary' disabled={!role._id} onClick={()=>this.setState({isShowAuth:true})}>设置角色权限</Button>
            </span>
        )

         return(
             <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={roles}
                    columns={this.columns}
                    pagination={{defaultPageSize:PAGE_SIZE}}
                    rowSelection={{
                        type:'radio',
                        selectedRowKeys:[role._id],
                        onSelect:(role)=>{
                            this.setState({role})
                        }
                    }}//指定选中项
                    onRow={this.onRow}//设置点击行，获得该行角色并更新
                />

                <Modal
                  title="添加角色"
                  visible={isShowAdd}//状态为1时可视化
                  onOk={this.addRole}//添加分类的事件函数
                  onCancel={()=>{this.setState({
                      isShowAdd:false
                  })}}
                >
                    {/*徐1： 我们需要传一个setForm过去，传的是一个函数类型的属性，且该函数是用来接收form的，所以要把接收到的form存起来用this.form */}
                  <AddForm 
                  setForm={(form)=>{this.form=form}}
                  /> 
                             
                </Modal>
                <Modal
                  title="设置角色权限"
                  visible={isShowAuth}//状态为1时可视化
                  onOk={this.updateRole}//添加分类的事件函数
                  onCancel={()=>{this.setState({
                      isShowAuth:false
                  })}}
                >
                  <AddAuth role={role} ref={this.autH} />   
                </Modal>
             </Card>
         )
     }
 }