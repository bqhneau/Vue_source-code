const obj = {};

// 通过 Object.defineProperty 创建属性
Object.defineProperty(obj,'a',{
    value:3,
    // 是否可写
    writable:false
})

Object.defineProperty(obj,'b',{
    value:2,
    // 是否可枚举
    enumerable:false
})

Object.defineProperty(obj,'c',{
    get(){
        console.log('读取c属性')
    },
    set(){
        console.log('修改c属性')
    }
})

// Object.defineProperty 需要变量中转才能工作
let temp
Object.defineProperty(obj,'d',{
    get(){
        console.log('读取c属性')
        return temp   // 没有return时 返回 undefined
    },
    set(newValue){
        console.log('修改c属性',newValue)
        temp = newValue
    }
})

obj.d = 0
console.log(obj.d)
obj.d ++

// 使用闭包构造 defineReactive
function defineReactive(data,key,val){
    if(arguments.length == 2){
        val = data[key]
    }
    Object.defineProperty(data,key,{
        // 可枚举
        enumerable:true,
        // 可配置
        configurable:true,
        get(){
            console.log('读取c属性')
            return val
        },
        set(newValue){
            console.log('修改c属性',newValue)
            if(val === newValue) return
            val = newValue
        }
    })
}

defineReactive(obj,'e',20)   // 对象 键 初始值