export default class Dep{
    constructor(){
        // 数组中为依赖 即watcher的实例
        this.subs = [];
    }

    //依赖收集
    depend(){
        if(Dep.target){
            // Dep.target 记录依赖并收集依赖
            this.subs.push(Dep.target)
        }
    }

    // 派发更新
    notify(){
        // 浅克隆
        const subs = this.subs.slice();
        // 遍历 执行所有依赖的 update()
        for(let i =0,l=subs.length;i<l;i++){
            subs[i].update()
        }
    }
}