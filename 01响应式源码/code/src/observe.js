// observe 函数
// 辅助判别

import Observer from "./Observer";

export default function (value){
    // 如果传入的值不是对象 什么都不做
    if(typeof value !== 'object') return

    // 声明实例 ob
    var ob;

    // 先判断当前属性上是否含有 __ob__ 属性
    if (typeof value.__ob__ !== 'undefined') {
        // 有 => 直接赋值给 ob
        ob = value.__ob__
    } else {
        // 无 => 创建实例赋值给 ob
        ob = new Observer(value)
    }

    return ob;
}