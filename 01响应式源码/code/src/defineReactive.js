// 辅助函数 响应式关键
import Dep from "./Dep"
import observe from "./observe"

export default function defineReactive(data,key,val){
    // 无用代码 每次生成observer实例时 都会自动生成 dep 「多此一举」
    //「真正作用」：取到 dep 实例
    const dep = new Dep()

    if(arguments.length == 2){
        val = data[key]
    }

    // 对于对象每个属性 进行 observe 形成递归
    let child = observe(val)

    Object.defineProperty(data,key,{
        // 可枚举
        enumerable:true,
        // 可配置
        configurable:true,
        get(){
            console.log('读取'+key+'属性',val)

            // 依赖收集
            if(Dep.target){
                dep.depend();
                if(child) child.dep.depend()
            }

            return val
        },
        set(newValue){
            console.log('修改'+key+'属性',newValue)
            if(val === newValue) return
            val = newValue
            // 对于新值 observe
            child = observe(newValue)

            // 派发更新
            dep.notify()
        }
    })
}