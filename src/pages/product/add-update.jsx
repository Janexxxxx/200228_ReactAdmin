import React,{Component} from 'react';
import {Card,Form,Input, Icon,Button,Cascader, message} from 'antd';
import LinkButton from '../../components/link-button';
import {reqCategorys, reqAddOrUppdateProduct} from '../../api';
import PicturesWall from './pictures-wall';
import RichTextEditor from './rich-text-editor'
import PropTypes from 'prop-types'
const {Item} =Form



/**
 * Product的添加和更新的子路由组件
 */

  class ProductAddUpdate extends Component{

    // static propTypes={
    //     detail:PropTypes.string
    // }

    state = {
        options:[],
      }

    constructor(props){
        super(props)

        //用来创建保存ref标识的标签对象的容器
        this.pw=React.createRef()
        this.detail=React.createRef()
    }


    initOptions=async (categorys)=>{
        //根据categorys数组生成options数组
       const options= categorys.map(c=>({
            value: c._id,
            label: c.name,
            isLeaf: false,
        }))

        //这里是上来就进行二级分类,且是在更新时运行
        //如果是一个二级分类商品的更新
        const {isUpdate,product}=this
        const {pCategoryId,categoryId}=product
        //对应的是查看详情且父分类id不等于0
        if(isUpdate && pCategoryId!=='0'){
            //获取对应的二级分类列表
            const subCategorys=await this.getCategorys(pCategoryId)
            //生成二级下拉列表的options
            const childOptions=subCategorys.map(c=>({
                value:c._id,
                label:c.name,
                isLeaf:true
            }))

            //找到当前商品对应的一级option对象
            const targetOption = options.find(option=>option.value===pCategoryId)
            //关联对应的一级option上
            targetOption.children=childOptions
        }


        //更新options状态
        this.setState({
            options
        })
        console.log('options',options);
        
    }  

    /**异步获取一级/二级分类列表，并显示
     * async函数的返回值是一个新的promise对象，promise的结果和值由async的结果来决定
     */
    getCategorys=async (parentId)=>{
        const result = await reqCategorys(parentId)
        //debugger
        if(result.status===0){
            const categorys=result.data
            //如果是一级分类列表
            if(parentId==='0'){
                this.initOptions(categorys)
            }else{//二级列表
                return categorys //返回二级列表==> 当前async函数返回的promise就会成功且value为categorys
            }
           
        }
    }


    /**
     * 验证价格的自定义验证函数
     */
    validatePrice=(rule,value,callback)=>{
        if(value*1>0){
            callback()
        }else{
            callback('价格必须大于0')
        }
    }

    /**用于加载下一级列表的回调函数 */
    loadData =async selectedOptions => {
        //得到选择的option对象，targetOption为option数组里面的某一个option对象
        const targetOption = selectedOptions[0];
        //显示loading
       targetOption.loading = true;


        //根据选中的分类，请求获取二级分类列表
        //这里想得到异步返回的结果，所以必须加await
        //这里是已经选中一级分类才来更新二级分类
        const subCategorys=await this.getCategorys(targetOption.value)
       // debugger
        targetOption.loading = false
        if(subCategorys && subCategorys.length>0){
            //生成一个二级列表的options
            const childOptions=subCategorys.map(c=>({
                value:c._id,
                label:c.name,
                isLeaf:true
            }))
            //关联到当前option上
            targetOption.children=childOptions
        }else{
            targetOption.isLeaf=true
        }
        this.setState({
            options: [...this.state.options],
          })//咩有更新状态导致点击一次没有反应，点第二次才有反应
    
   /*     // load options lazily
        //用定时器模拟loading效果
        setTimeout(() => {
            //隐藏loading
          targetOption.loading = false;
          //指定项的下一级列表
          targetOption.children = [
            {
              label: `${targetOption.label} Dynamic 1`,
              value: 'dynamic1',
            },
            {
              label: `${targetOption.label} Dynamic 2`,
              value: 'dynamic2',
            },
          ];

          //更新options状态，注意这种解构写法
          this.setState({
            options: [...this.state.options],
          });
        }, 1000);*/
      }
    
    submit=() => {
        //进行表单验证，如果通过了才发送请求
        this.props.form.validateFields(async (error,values)=>{
           if(!error){
               //console.log('submit()',values)


               //1、收集数据,并封装成product对象
               const{name,desc,price,categoryIds}=values
               let pCategoryId,categoryId
               if(categoryIds.length===1){
                   pCategoryId='0'
                   categoryId=categoryIds[0]
               }else{
                   pCategoryId=categoryIds[0]
                   categoryId=categoryIds[1]
               }
               const imgs=this.pw.current.getImgs()
               const detail=this.detail.current.getDetail()
               console.log('details',detail);
               

               const product={name,desc,price,pCategoryId,categoryId,imgs,detail}

               //如果是更新，需要添加_id
               if(this.isUpdate){
                   product._id=this.product._id
               }
               //2、调用接口请求函数去添加/更新
               const result=await reqAddOrUppdateProduct(product)
               console.log('得到了吗',result);
               

               //3、根据结果提示
               if(result.status===0){
                   message.success(`${this.isUpdate?'更新':'添加'}商品成功！`)
                   this.props.history.goBack()
               }else{
                   message.error(`${this.isUpdate?'更新':'添加'}商品失败！`)
               }
              
           } 
        })
    }

 

    componentDidMount () {
        this.getCategorys('0')
    }

    //在render之前执行一次，为render同步准备东西
    componentWillMount(){
        //取出携带的state
        const product = this.props.location.state//如果是添加没值，否则有值
        //!!强制转换成布尔值，保存是否是更新的标识
        this.isUpdate=!!product

        //这一步相当于把product存起来，方便后面调用。  ||{}是为了防止点击添加时报错设置的
        this.product=product || {}
    }
     render(){
        const {isUpdate,product} = this

        //首先解构product
        const {pCategoryId,categoryId,imgs,detail}=product
        console.log(pCategoryId,categoryId);
        
        //再定义一个空数组，用来接收级联分类ID的数据
        const categoryIds = []
        if(isUpdate){
            //如果商品是一个一级分类的商品
            if(pCategoryId==='0'){
                categoryIds.push(categoryId)
            }else{
            //如果商品是一个二级分类的商品
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
                console.log('ssssaahah',pCategoryId,categoryId);
                console.log('haha',categoryIds);
            }
            
        }


        const layout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 8 },
          };
         const title =(
             <span>
                 <LinkButton onClick={()=>{this.props.history.goBack()}}>
                    <Icon type='arrow-left'/>                    
                 </LinkButton>
                 <span>添加商品</span>
             </span>
         )
        const {getFieldDecorator}=this.props.form

         return(
             <Card title={title}>
                 <Form  {...layout}>  
                    <Item label='商品名称'>
                        {
                            getFieldDecorator('name',{
                                initialValue:product.name,
                                rules:[
                                    {required:true,message:'商品名称必须输入'}
                                ]
                            })(<Input placeholder='请输入商品名称'/>)
                        }            
                    </Item>
                    <Item  label='商品描述'>
                        {
                            getFieldDecorator('desc',{
                                initialValue:product.desc,
                                rules:[
                                    {required:true,message:'商品描述必须输入'}
                                ]
                            })( <Input.TextArea placeholder='请输入商品描述' autoSize={{minRows:2,maxRows:6}} />)
                        }  
                       
                    </Item>
                    <Item  label='商品价格'>
                        {
                            getFieldDecorator('price',{
                                initialValue:product.price,
                                rules:[
                                    {required:true,message:'商品价格必须输入'},
                                    {validator:this.validatePrice}
                                ]
                            })(  <Input type='number' addonAfter="元" placeholder='请输入商品价格'/>)
                        }  
                       
                    </Item>
                    <Item  label='商品分类'>
                        {
                            getFieldDecorator('categoryIds',{
                                initialValue:categoryIds,
                                rules:[
                                    {required:true,message:'商品分类必须输入'},
                               
                                ]
                            })( <Cascader
                                placeholder='请指定商品分类'
                                options={this.state.options}/**需要显示的列表数据数组 */
                                loadData={this.loadData}/**当选择某个列表项，加载下一级列表的监听回调函数 */
                               
                            />)
                        } 
                    
                    </Item>
                    <Item  label='商品图片'>
                        <PicturesWall ref={this.pw} imgs={imgs}/>
                    </Item>
                    
                    <Item  label='商品详情' labelCol= {{ span: 2 }} wrapperCol={{ span: 20 }}>
                        <RichTextEditor ref={this.detail} detail={detail}/>
                    </Item>
                    <Item>
                        <Button type='primary' onClick={this.submit}>提交</Button>
                    </Item>
                 </Form>
             </Card>
         )
     }
 }
 export default Form.create()(ProductAddUpdate)

 /**
  * 1、子组件调用父组件的方法：将父组件的方法以函数属性的形式传递给子组件，子组件就可以调用
  * 2、父组件调用子组件的方法：在父组件中通过ref得到子组件标签对象(也就是组件对象)，调用其方法
  * 
  */