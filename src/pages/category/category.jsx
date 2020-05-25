import React,{Component} from 'react';
import {Card,Table,Button,Icon, message,Modal, Form} from 'antd'
import LinkButton from '../../components/link-button'
import { reqCategorys,reqUpdateCategory,reqAddCategory } from '../../api';
//import { resolveOnChange } from 'antd/lib/input/Input';
import AddForm from './add-form';
import UpdateForm from './update-form';


/**
 * 商品分类路由
 */


 /**
  * 静态界面
  * 接口请求函数
  * 动态显示一级列表
  *     首先要发请求获取一级分类列表的数据，获取到保存到状态里面，一更新状态我的组件就会重新渲染并且显示该列表
  *     故第一步是设计状态state
  * 
  */
 export default class Category extends Component{
//首先第一步要设计状态，需要有一个状态来存一级分类的数组
    state={
        loading:false,
        categorys:[],//一级分类列表，即render()里面的dataSource
        subCategorys:[],//二级分类列表
        parentId:'0',//当前需要显示的分类列表的父分类ID
        parentName:'',//当前需要显示的分类列表的父分类名称
        showStatus:0,//标识添加/更新的确认框是否显示，0：都不显示，1：显示添加，2：显示更新
    }

    /***
     * 初始化Table所有列的数组
     */
    initColumns=()=>{
        this.columns = [
            {
              title: '分类的名称', 
              dataIndex: 'name',//显示数据对应的属性名
        
            },
            {
              title: '操作',
              width:300,
              render:(category)=>(//返回需要显示的界面标签，该标签是通过查找antd文档获得的
                  <span>
                    {/**更新分类第二步 */}
                      <LinkButton onClick={()=>this.showUpdate(category)}>修改分类</LinkButton>
                      {/**如何向事件回调函数传递参数：先定义一个匿名（箭头）函数，
                       * 再在函数中调用处理的函数并传入数据.
                       * 如果不使用箭头函数，那这个函数会在一渲染就被调用，
                       * 而不是在点击的时候才调用
                       */}
                       {this.state.parentId==='0'?<LinkButton onClick={()=>this.showSubCategorys(category)}>查看子分类</LinkButton>:null}
                      
                  </span>
              )
  
            },
            
          ]

    }


    /**
     * 异步获取一级或二级分类列表显示
     * parentId:如果没有指定根据状态中的parentId请求，如果指定了根据指定的请求
     */

    getCategorys=async (parentId)=>{
        //在发请求前，显示loading
        this.setState({loading:true})
        parentId=parentId||this.state.parentId
        //发异步ajax请求，获取数据
        //这里不一定就是0
        const result=await reqCategorys(parentId)//至于返回的结果是什么，看接口文档
        //在请求之后(不管成功/失败)，隐藏loading
        this.setState({loading:false})
        if(result.status===0){
            //取出分类数据（可能是一级也可能是二级的）
            const categorys=result.data
            if(parentId==='0'){
               //更新一级分类状态
               this.setState({
                 categorys
               })
             }else{
              //更新二级分类状态
               this.setState({
                 subCategorys:categorys
               })
             }
            

        }else{
            message.error('获取分类列表失败')
        }
    }


    /**
     * 显示指定一级分类对象的二级子列表
     */
   //查看子分类按钮
    showSubCategorys=(category)=>{
      //首先是更新状态
      //知识点，setState()不能立即获取最新的状态，因为setState()是异步更新状态的，
      //即将showSubCategorys执行完才更新状态，而回调函数可以在状态更新之后才执行
      //去印记中文中找React文档的React.Component的setState的用法
      this.setState({
        parentId:category._id,
        parentName:category.name,
      },()=>{
        //回调函数会在状态更新且重新render()后执行
        console.log('paerntId',this.state.parentId)
        //获取二级分类列表显示
        this.getCategorys()
      })

      
    }
    /**
     * 显示指定一级分类列表
     */
    //一级分类列表 按钮
    showCategorys=()=>{
      this.setState({
        parentId:'0',
        parentName:'',
        subCategorys:[]
      })

    }

    /**
     * 响应点击取消：即隐藏确认框
     */
    //cancel按钮
    handleCancel=()=>{

      //清除输入数据
      this.form.resetFields()

      this.setState({
        showStatus:0
      })
    }


    /**
     * 显示添加的确认框
     */
    //添加按钮
    showAdd=()=>{
      this.setState({
        showStatus:1
      })
    }
    /**
     * 添加分类
     */
    //添加的OK按钮
    addCategory=()=>{
      this.form.validateFields(async(err,values)=>{
        if(!err){
          console.log('addCategory()');

          this.setState({
            showStatus:0
          })
    
          //const{parentId,categoryName}=this.form.getFieldsValue()
          const{parentId,categoryName}=values
          //清除输入数据
          this.form.resetFields()
    
          const result=await reqAddCategory(categoryName,parentId)
    
          //进行优化
          if(result.status===0){
            if(parentId===this.state.parentId){
              this.getCategorys()
            }else if(parentId==='0'){
              this.getCategorys('0')
            }
            
          }
        }
      })

    }

    /**
     * 显示更新的确认框
     */
    /**更新分类第三步 */
    //修改分类按钮
    showUpdate=(category)=>{
      //在该方法中不需要category，但在render()里面需要，所以现在这里
      //把他保存起来
      this.category=category
      //更新状态
      this.setState({
        showStatus:2
      })
    }
    /**
     * 更新分类
     */
    //修改分类OK按钮
    updateCategory=()=>{
      this.form.validateFields(async(err,values)=>{
        if(!err){
          console.log('uppdateCategory()')
          //1、隐藏确定框
          this.setState({
            showStatus:0
          })

          //准备数据
          //但存在一个问题，只有子组件有form对象，父组件没有，
          //所以涉及到组件间的通信问题：1种调用第三方的巴拉巴拉...（适用于兄弟组件或祖孙组件）
          //第二种通过props传递一般属性（父到子）或函数属性（子到父）
          const categoryId=this.category._id
         // const categoryName=this.form.getFieldValue('categoryName')
          const {categoryName}=values
        
          //清除输入数据
          this.form.resetFields()

          //2、发请求更新分类
          const result=await reqUpdateCategory({categoryId,categoryName})
        
          if(result.status===0){
            //3、重新显示列表
            
            this.getCategorys()
            
          }
        }
      })
      

    }


    /**
     * 同步准备一个数组，不需要每次更新渲染
     * 为第一个render()准备数据
     */
    componentWillMount(){
        this.initColumns()
    }

    /**
     * 接着要选择一个合适的时机发送请求获取分类列表并更新状态
     * 执行异步任务：发异步ajax请求
     */
    componentDidMount(){
      //初始值parentId:'0'决定了第一次一定会获取一级分类列表
        this.getCategorys()
    }


     render(){

        //第二步，在render中需要读取状态数据显示到table中
        const{categorys,loading,subCategorys,parentId,parentName,showStatus}=this.state
        
        /**更新分类第四步 */
        //读取指定的分类
        const category=this.category||{}//如果还没有指定一个空对象
        //card左侧
        const title=parentId==='0'?'一级分类列表':(
          <span>
            {/**点击一级分类列表时会返回到一级列表 */}
            <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
            <Icon type='arrow-right' style={{marginRight:5}}/>
            <span>{parentName}</span>
          </span>
        )
        //card右侧
        const extra=(
            <Button type='primary' onClick={this.showAdd}>
                <Icon type='plus'/>
                添加
            </Button>
        )

         return(
            <Card title={title} extra={extra} >
                <Table 
                    bordered//带边框的表格
                    rowKey='_id'//使用Table中的属性rowKey，即某一行的key值。需要指定唯一的key相当于一个标识
                    //第三步，将categorys变量放入大括号中
                    dataSource={parentId==='0'?categorys:subCategorys} 
                    loading={loading}
                    columns={this.columns}
                    //分页器，是对象{{}},defaultPageSize表示一页显示几个  
                    //showQuickJumper表示快速跳转
                    pagination={{defaultPageSize:5,showQuickJumper:true}}
                     />
               {/**Modal为添加和修改的两个框 */}
                <Modal
                  title="添加分类"
                  visible={showStatus===1}//状态为1时可视化
                  onOk={this.addCategory}//添加分类的事件函数
                  onCancel={this.handleCancel}
                >
                  <AddForm 
                 
                  categorys={categorys} 
                  parentId={parentId}
                  setForm={(form)=>{this.form=form}}
                  />
             
                </Modal>     
                <Modal
                  title="更新分类"
                  visible={showStatus===2}
                  onOk={this.updateCategory}//更新分类的事件函数
                  onCancel={this.handleCancel}
                >
                  {/**更新分类第一步 */}
                  {/**函数类型的props， 要给这个子组件标签传函数属性，这个函数属性最终要
                   * 传递form对象,即函数的参数,并把form给存起来方便别的组件可以调用
                  */}
                  <UpdateForm 
                  categoryName={category.name} 
                  setForm={(form)=>{this.form=form}}
                  />
                
                </Modal>
              </Card>

         )
     }
 }
 