/**
 * 用来进行local数据存储管理的工具模块
 * 要提供好多方法，可以对这些方法分别暴露，也可以一次性暴露
 * 这里选择一次性暴露
 */
import store from 'store';
const USER_KEY='user_key';
export default {
    /**
     * 保存user
     */
    saveUser(user){
        //localStorage.setItem(USER_KEY,JSON.stringify);//需要传这个对象的json数据格式
        store.set(USER_KEY,user);  
    },
    /**
     * 读取user
     */
    getUser(){
        //return JSON.parse(localStorage.getItem(USER_KEY)||'{}');//localStorage.getItem('user_key')如果有值是一个JSON格式的字符串，万一没值
                                                                //会返回null，这样解析出来不太好，希望没有值时解析出来的是空串，所以用||补充
        return store.get(USER_KEY)||{};
    },
    /**
     * 删除user
     */
    removeUser(){
        //localStorage.removeItem(USER_KEY);
        store.remove(USER_KEY);
    }
}