/*
    每个组件实例会有相应的watcher实例「依赖」
        会在组件渲染的过程中记录依赖的所有数据属性（进行依赖收集,还有computed watcher,user watcher实例）,
        之后依赖项被改动时,setter方法会通知依赖与此data的watcher实例重新计算（「update」派发更新）,
        从而使它关联的组件重新渲染
*/ 

import Dep from './Dep'

export default class Watcher{
    constructor(target,expression,callback){
        // target 目标对象
        // express 路径表达式
        // callback 回调函数

        this.target = target;
        this.getter = parsePath(expression)
        this.callback = callback;
        this.value = this.get()
    }

    // 当收到数据变化时，执行 update 更新页面模版
    update () {
        this.run()
    }

    // 「关键之处」动数据前后设置 Dep.target
    get(){
        // 进入依赖收集： 
        Dep.target = this;
        const obj = this.target;
        var value

        try {
            // 获取数据：触发 defineReactive的get
           value =  this.getter(obj)
        } finally {
            // 退出依赖收集
            Dep.target = null 
        }

        return value
    }

    run(){
        this.getAndInvoke(this.callback);
    }

    getAndInvoke(cb){
        const value = this.get()

        // 判断值是否变化
        if(value !== this.value || typeof value == 'object'){
            const oldValue = this.value;
            this.value = value;
            // 「执行回调」
            cb.call(this.target,value,oldValue)
        }
    }
}

// 工具函数 解析字符串
function parsePath(str) {
    var segments = str.split('.');

    return (obj) => {
        for (let i = 0; i < segments.length; i++) {
            if (!obj) return;
            obj = obj[segments[i]]
        }
        return obj;
    };
}