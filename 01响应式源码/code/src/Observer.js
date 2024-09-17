// 新建工具类 Observer
// 将一个正常的 object 转化为「每个层级的属性都是响应式」的 object

import def from "./utils"
import defineReactive from "./defineReactive"
import {arrayMethods} from './array'
import observe from "./observe"
import Dep from "./Dep"

export default class Observer{
    constructor(value){
        console.log(value)
        // 为「每个对象」添加依赖管理器 Dep
        this.dep = new Dep()
        
        // 给 value 添加 __ob__ 不可枚举
        def(value,'__ob__',this,false)
        // 核心：给 value 添加响应式
        if(Array.isArray(value)){
            // 「数组响应式关键」：强行改变原型（Object.setPrototypeOf）
            Object.setPrototypeOf(value,arrayMethods)
            // 数组的遍历并追加响应式
            this.observeArr(value)
        }else{
            this.walk(value)
        }
    }

    walk(value){
        for (const key in value) {
            if (Object.prototype.hasOwnProperty.call(value, key)) {
                defineReactive(value,key)
            }
        }
    }

    // 数组的特殊遍历
    observeArr(arr){
        for(let i=0,l=arr.length;i<l;i++){
            // 逐项 observe
            observe(arr[i])
        }
    }
}