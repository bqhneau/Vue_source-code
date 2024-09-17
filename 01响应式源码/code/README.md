
数据变化 ，视图会自动变化

## 侵入式和非侵入式
    改变数据的时候有没有 调用「官方提供的API」

### 非侵入式
- vue 
```js
    this.a ++
```
### 侵入式
- react
```jsx
    this.setState({
        a:this.state.a + 1
    })
```
- 小程序
```js
    this.setDate({
        a:this.data.a + 1
    })
```


## 响应式系统的基础 Object.defineProperty

- 可以设置属性是否可写（writable）
    
```js
    Object.defineProperty(obj,'a',{
        value:3,
        // 是否可写
        writable:false
    })
```

- 可以设置属性是否可枚举（enumerable）
```js
    Object.defineProperty(obj,'a',{
        value:3,
        // 是否可枚举
        enumberable:false
    })
```

- get 与 set
```js
    Object.defineProperty(obj,'c',{
        get(){
            console.log('读取c属性')
        },
        set(){
            console.log('修改c属性')
        }
    })
```


## defineReactive 函数
    构造闭包 让内层get和set能够恰当的 `return`

- 原因：Object.defineProperty 需要「临时变量」才能工作
    MDN：get 函数返回值将被用作属性的值，不返回为 undefined
```js
    let temp
    Object.defineProperty(obj,'d',{
        get(){
            console.log('读取c属性')
            //return temp
        },
        set(newValue){
            console.log('修改c属性',newValue)
            temp = newValue
        }
    })
```

- 解决：构造闭包——defineReactive
```js
function defineReactive(data,key,val){
    Object.defineProperty(data,key,{
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
```


## 递归侦测对象全部属性

- observe 
    辅助函数 动态生成 ob 实例
```js
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
```

- Observer[观察者]:
    将一个正常的 object 转化为「每个层级的属性都是响应式」的 object
    - 为属性 添加 `__ob__` 属性
    - 遍历「顶层属性」，调用 defineReactive 添加响应式 
```js
import def from "./utils"
import defineReactive from "./defineReactive"

export default class Observer{
    constructor(value){
        console.log('Observer',value)
        // 给 value 添加 __ob__ 不可枚举
        def(value,'__ob__',this,false)
        // 核心：给 value 添加响应式
        this.walk(value)
    }

    walk(value){
        for (const key in value) {
            if (Object.prototype.hasOwnProperty.call(value, key)) {
                defineReactive(value,key)
            }
        }
    }
}
```

- defineReactive
    辅助函数 为每一个属性 追加响应式
    - 「子属性」调用 observe，递归为所有属性添加响应式
```js
import observe from "./observe"

export default function defineReactive(data,key,val){
    if(arguments.length == 2){
        val = data[key]
    }

    // 对于对象每个属性 进行 observe 形成递归
    observe(val)

    Object.defineProperty(data,key,{
        // 可枚举
        enumerable:true,
        // 可配置
        configurable:true,
        get(){
            console.log('读取'+key+'属性')
            return val
        },
        set(newValue){
            console.log('修改'+key+'属性',newValue)
            if(val === newValue) return
            val = newValue
            // 对于新值 observe
            observe(newValue)
        }
    })
}
```

## 数组的响应式处理
```
    整体思路：
        1、重写数组的七个方法
```

### 改写数组的七种方法
    - push
    - pop
    - shift
    - unshift
    - splice
    - sort
    - reverse
```
    思路分析
        1、基于数组的原型 创建一个对象
        2、在该对象上重写七个方法 并保证 this 正常
        3、在 Observer 类中，判断数组，「强行改变数组的原型」
```
- array.js
```js
import def from "./utils";

// 1、拿到 array 原型
const arrayPrototype = Array.prototype;

// 2、以 arrayPrototype 为原型创建 arrayMethods 对象
export const arrayMethods = Object.create(arrayPrototype)

// 3、重写方法
const methods = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
]

methods.forEach(methodName => {
    // 备份方法
    const origin = arrayPrototype[methodName];

    // 重写方法 并 保证执行
    def(arrayMethods,methodName,function(){
        // 保证函数的「this」正常
        const res = origin.apply(this, arguments);

        return res
    },false)
});
```

- Observer
    如果是数组，强制改变原型
```js
// 核心：给 value 添加响应式
        if(Array.isArray(value)){
            // 「数组响应式关键」：强行改变原型（Object.setPrototypeOf）
            Object.setPrototypeOf(value,arrayMethods)
        }else{
            this.walk(value)
        }
```

### 为数组每个属性添加响应式
- 初始化阶段 遍历添加
```js
// 核心：给 value 添加响应式
        if(Array.isArray(value)){
            // 「数组响应式关键」：强行改变原型（Object.setPrototypeOf）
            Object.setPrototypeOf(value,arrayMethods)
            // 数组的遍历并追加响应式
            this.observeArr(value)
        }else{
            this.walk(value)
        }

// 数组的特殊遍历
    observeArr(arr){
        for(let i=0,l=arr.length;i<l;i++){
            // 逐项 observe
            observe(arr[i])
        }
    }
```

- 调用数组方法 插入新元素时 需要添加
```js
// 为新插入的数组元素添加响应式
        const args = [...arguments]  // 将伪数组变为数组
        const ob = this.__ob__;
        let inserted = [];

        switch (methodName) {
            case 'push':

            case 'unshift':
                inserted = args
                break
            case 'splice':
                inserted = args.slice(2)
                break
        }

        // 判断有没有插入的新项 让新项也变成响应式
        if(inserted){
            ob.observeArr(inserted)
        }
```


## 依赖收集
- 需要用到数据的地方，称为依赖
  - Vue1.x 细粒度 DOM 
  - Vue2.x 中等粒度 组件
- 在 getter 依赖收集，在 setter 派发更新 

### Dep类 和 Watcher类
- Dep类
```
    1、用来管理依赖（在 getter 依赖收集，在 setter 派发更新）
    2、每个 Observer实例中，都有一个 Dep 实例
```
- Watcher类
```
    1、Watcher的实例 实际上就是依赖
    2、首次创建时，在 Dep 追加自己
    3、「watcher.update()」在dep.notify()中执行
    4、数据变化时，由 Dep 调用 `dep.notify()` ，实际调用`watcher.update()` 通知组件更新 
```

### 依赖收集的巧妙之处
- 明确依赖：谁用到了这个数据，谁就是依赖
- 如何捕获依赖
```
    1、引入全局变量 Dep.target
    2、在某个 watcher `get`我们的数据前，我们设置全局变量，随后设置为 null
    3、这样在依赖收集时，我们只需要观察「Dep.target」是否存在即可
    4、如果存在，就说明依赖触发了，我们将这个依赖收集起来
```

### watcher 再总结
```
    1、当实例化Watcher类时，会先执行其构造函数；
    2、在构造函数中调用了「this.get()」实例方法；
    3、在get()方法中，
        首先通过「Dep.target = this」把实例自身赋给了全局的一个唯一对象「Dep.target」，
        然后通过「value =  this.getter(obj)」获取一下被依赖的数据，
        获取被依赖数据的目的是「触发该数据上面的get」（在get里会调用dep.depend()收集依赖，并且，在dep.depend()中取到挂载dep.target上的值并将其存入依赖数组中）
        在get()方法最后将window.target释放掉
    4、当数据变化时，
        会触发数据的setter，在setter中调用了dep.notify()方法，
        在dep.notify()方法中，遍历所有依赖(即watcher实例)，执行依赖的update()方法
        也就是Watcher类中的update()实例方法，
        在update()方法中调用数据变化的更新回调函数，从而更新视图
```

## 总结
```
    当创建Vue实例时,vue会递归遍历「defineReactive 和 observe」data选项的属性,
        利用Object.defineProperty为属性添加getter和setter对数据的读取进行劫持
        getter用来依赖收集「depend」,setter用来派发更新「notify」,
        并且在内部通过「Dep类」追踪依赖「depend」,在属性被访问和修改时通知变化「notify」。

    每个组件实例会有相应的watcher实例「依赖」
        会在组件渲染的过程中记录依赖的所有数据属性（进行依赖收集,还有computed watcher,user watcher实例）,
        之后依赖项被改动时,setter方法会通知依赖与此data的watcher实例重新计算（「update」派发更新）,
        从而使它关联的组件重新渲染
```