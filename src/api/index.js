/**
 * 要求：能根据接口文档定义接口请求
 * 包含应用中所有接口请求函数的模块
 * 每个函数的返回值都是promise
 * 
 * 
 * 达到基本要求：能根据接口文档定义接口请求函数
 */
import jsonp from 'jsonp'
import ajax from './ajax'
import { message } from 'antd';


//const BASE='http://localhost:5000'
const BASE=''
//登录
/**
 * export function reqLogin(username,password){
 *  return ajax ('/login',{username,password},'POST')
 * }
 */
export const reqLogin =(username,password)=>ajax(BASE+'/login',{username,password},'POST');

//添加/更新用户
export const reqAddOrUpdateUser=(user)=>ajax(BASE+'/manage/user/'+(user._id?'update':'add'),user,'POST');

//获取一级/二级分类的列表
export const reqCategorys=(parentId)=>ajax(BASE+'/manage/category/list',{parentId})

//添加分类
export const reqAddCategory=(categoryName,parentId)=>ajax(BASE+'/manage/category/add',{categoryName,parentId},'POST')

//更新分类。添加分类和更新分类分别展示了两种形参的写法
export const reqUpdateCategory=({categoryId,categoryName})=>ajax(BASE+'/manage/category/update',{categoryId,categoryName},'POST')

//获取商品分页列表
export const reqProducts=(pageNum,pageSize)=>ajax(BASE+'/manage/product/list',{pageNum,pageSize})

//根据ID/Name搜索产品分页列表
export const reqSearchProducts=({pageNum,pageSize,productType,searchName})=>ajax(BASE+'/manage/product/search',
{
    pageNum,
    pageSize,
    [productType]:searchName
})

export const reqCategory=(categoryId)=>ajax(BASE+'/manage/category/info',{categoryId})

export const reqUpdateStatus=(productId,status)=>ajax(BASE+'/manage/product/updateStatus',{productId,status},'POST')

//删除指定名称的图片
export const reqDeleteImg=(name)=>ajax(BASE+'/manage/img/delete',{name},'POST')

//添加/修改商品
export const reqAddOrUppdateProduct=(product)=>ajax(BASE+'/manage/product/'+(product._id?'update':'add'),product,'POST')


//获取所有角色的列表
export const reqRoles=()=>ajax(BASE+'/manage/role/list')

//添加角色
export const reqAddRole=(roleName)=>ajax(BASE+'/manage/role/add',{roleName},'POST')

//更新角色
export const reqUpdateRole=(role)=>ajax(BASE+'/manage/role/update',role,'POST')

//获取所有用户列表
export const reqUsers=()=>ajax(BASE+'/manage/user/list')

//删除用户
export const reqDeleteUser=(userId)=>ajax(BASE+'/manage/user/delete',{userId},'POST') 

/**
 * 将jsonp接口封装成接口请求函数,所有的接口请求函数都要是promise函数
 */
export const reqWeather=(city)=>{

    return new Promise((resolve,reject)=>{
        const url=`http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`/**这里不是单引号 */
        jsonp(url,{},(err,data)=>{//查找的jsonp库中的jsonp()函数
        console.log('jsonp()',err,data)//这里的date就是成功接收到的数据，接口文档中给出了，我们只要取出我们想要的部分就可以了
        //如果成功了
        if(!err&&data.status==='success'){//细心一点，不要老是拼错
            //解构取出需要的数据
            const {dayPictureUrl,weather}=data.results[0].weather_data[0]
            resolve({dayPictureUrl,weather})
        }else{//如果失败了
            message.error('获取天气信息失败！')
        }
        
    })
    })
    

}
//reqWeather('上海')