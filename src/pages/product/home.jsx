import React,{Component} from 'react';
import{Card,Button,Table,Input,Select,Icon, message} from 'antd'
import LinkButton from '../../components/link-button'
import {reqProducts,reqSearchProducts,reqUpdateStatus} from '../../api'
import {PAGE_SIZE} from '../../utils/constants'

const Option=Select.Option
/**
 * Product的默认子路由组件
 */

 export default class ProductHome extends Component{


    state={
        loading:false,
        products:[],
        total:0,
        productType:'productName',
        searchName:'',
        

    }

    updateStatus=async (productId,status)=>{
        const result=await reqUpdateStatus(productId,status)
        if(result.status===0){
            message.success('更新商品成功')
            this.getProducts(this.pageNum)
        }
    }

    initColumns=()=>{
        
             this.columns = [
                {
                  title: '商品名称',
                  dataIndex: 'name',
                },
                {
                  title: '商品描述',
                  dataIndex: 'desc',
                },
                {
                  title: '价格',
                  dataIndex: 'price',
                  render:(price)=>'￥'+price,
                },
                {
                    width:100,
                    title: '状态',
                    //dataIndex: 'status',

                    render:(product)=>{
                        const {status,_id}=product
                        return(
                            <span>
                                <Button type='primary' 
                                onClick={()=>{this.updateStatus(_id,status===1?2:1)}}>{status===1?'下架':'上架'}</Button>
                                <span>{status===1?'在售':'已下架'}</span> 
                            </span>


                        )
                    }
                   
                },
                {
                    width:100,
                    title: '操作',
                    render:(product)=>{
                        return(
                            <span>
                                <LinkButton onClick={()=>this.props.history.push("/product/detail",{product})}>详情</LinkButton>
                                <LinkButton onClick={()=>this.props.history.push('/product/add-update',product)}>修改</LinkButton>
                            </span>


                        )
                    }
                  
                },
              ];
        
    }
    getProducts=async(pageNum)=>{
        this.pageNum=pageNum
        this.setState({loading:true})
        const {productType,searchName}=this.state
        let result
        if(searchName){
            
            result=await reqSearchProducts({pageNum,pageSize : PAGE_SIZE,productType,searchName})
        }else{
            result=await reqProducts(pageNum,PAGE_SIZE)
        }
       
        
        this.setState({loading:false})   
        if(result.status===0){
            const {total,list}=result.data
            this.setState({
                products:list,
                total
            })

            console.log('total'+total)
        }
        
    }
    componentWillMount(){
        this.initColumns()
    }
    componentDidMount(){
        this.getProducts(1)
    }
     render(){
         const {products,total,loading,productType,searchName}=this.state
         const title=(
             <span>
                 <Select 
                 value={productType} 
                 style={{width:150}}
                 onChange={(value)=>this.setState({productType:value})}
                 >
                     <Option value='productName'>按名称搜索</Option>
                     <Option value='productDesc'>按描述搜索</Option>
                 </Select>
                 <Input 
                 placeholder='关键字' 
                 style={{ width:150,margin:'0 15px'}} 
                 value={searchName} 
                 onChange={(event)=>this.setState({searchName:event.target.value})}
                 />
                 <Button type='primary' onClick={()=>this.getProducts(1)}>搜索</Button>
             </span>
         )
         const extra=(
         <Button type='primary' onClick={()=>this.props.history.push('/product/add-update')}>
              <Icon type='plus'/>
             添加商品
         </Button>
         )
         return(
            <Card title={title} extra={extra}>
                <Table
                bordered
                loading={loading}
                rowKey='_id' 
                dataSource={products} 
                columns={this.columns} 
                pagination={{
                    current:this.pageNum,
                    total,
                    defaultPageSize:PAGE_SIZE,
                    showQuickJumper:true,
                    onChange:this.getProducts
                }}/>
            </Card>
         )
     }
 }