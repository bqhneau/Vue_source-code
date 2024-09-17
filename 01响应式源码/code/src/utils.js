export default function(obj,key,value,enumerable){
    Object.defineProperty(obj,key,{
        value,
        enumerable,  // 触发简写
        writable:true,
        configurable:true
    })
}