import React,{Component} from 'react'
import PropTypes from 'prop-types'
import {Form,Select,Input,Tree} from 'antd'
import menuList from '../../config/menuConfig'
const Item = Form.Item
const { TreeNode } = Tree;
/**
 * 路由组件独有的子非路由组件放在它本身的文件夹下
 */

export default class AddAuth extends Component{

     static propTypes={
        role:PropTypes.object
     } 


     constructor(props){
        super(props)

        //根据传入角色的menus生成初始状态
        const {menus}=this.props.role
        this.state={
            checkedKeys:menus
         }

     }

     getAuth=()=>this.state.checkedKeys

     

     getTreeNodes=(menuList)=>{
         return menuList.reduce((pre,item)=>{
            pre.push(
                <TreeNode title={item.title} key={item.key}>
                    {item.children?this.getTreeNodes(item.children):null }
                </TreeNode>
            ) 
            return pre
         },[])

     }

     //选中某个node时的回调
     onCheck = checkedKeys => {
        console.log('onCheck', checkedKeys);
        this.setState({ checkedKeys });
      };

     componentWillMount(){
         this.treeNodes=this.getTreeNodes(menuList)
     }

     componentWillReceiveProps(nextProps){
         const menus=nextProps.role.menus
         this.setState({
             checkedKeys:menus
         })
     }

     render(){
        const {role}=this.props
        const {checkedKeys}=this.state
        const layout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 15 },
          };
         return(
             <div>
                 <Item label='角色名称' {...layout}>
                 <Input disabled value={role.name}/>
                </Item>

                <Tree 
                    checkable 
                    defaultExpandAll={true}
                    onCheck={this.onCheck}//当选中时
                    checkedKeys={checkedKeys}
                >
                    <TreeNode title="平台权限" key="all">
                        {this.treeNodes}
                    </TreeNode>
                </Tree>
             </div>

       
         )
     }
 }
