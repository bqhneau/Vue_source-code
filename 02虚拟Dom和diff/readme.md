## 简要介绍
```
    类比 装修房间 => 寻找一个「最小量更新」
```
- snabbdom
- snabbdom h 函数
- diff算法原理
- 手写 diff 算法

## 虚拟DOM和h函数
### 虚拟DOM
-  用 javaScript对象 描述DOM的层次结构
-  DOM中的一切属性都在虚拟DOM中有对应的属性

### diff 发生在「虚拟DOM」
    算出应该如何最小量更新，最后反映到真实DOM上。

### h函数用来产生虚拟节点
```js
    // 调用 h 函数
    h('a',{props:{href:'https://www.atguigu.com'}},'尚硅谷')

    // 虚拟节点
    {'sel':'a','data':{props:{href:'https://www.atguigu.com'}},'text':'尚硅谷'}

    // 真实DOM
    <a href='https://www.atguigu.com'>尚硅谷</a>
```

### 虚拟节点的属性
```js
    {
        children:undefined  // 子元素
        data：{}  // 属性
        ele：undefined   // DOM节点
        key：undefined   // 唯一标识
        sel：'div'   // 选择器
        text：'我是一个盒子'   // 文本内容
    }
```

### 创建虚拟节点 并上树
```js
// 创建 patch 函数
const patch = init([classModule,propsModule,styleModule,eventListenersModule]);

// 创建虚拟节点
const Vnode = h('a',{
    props:{
        href:'https://www.atguigu.com',
        target:'_black'
    }
},'尚硅谷');

// 让虚拟节点上树
const container = document.getElementById('container');
patch(container,Vnode)
```

### h函数 可以嵌套
    第三个参数以数组形式存在，如需嵌套，将h函数丢到里面
```js
// h函数可以嵌套
const Vnode2 = h('ul',{},[
    h('li',{},'苹果'),
    h('li',{},'苹果'),
    h('li',{},'苹果'),
    h('li',{},'苹果'),
])
```

## 手写 h 函数
```
    核心思路
        1、封装一个「将入参包裹成对象返回」的函数 vnode
        2、根据入参不同，动态调用 vnode
```
- vnode
```js
export default function (sel,data,children,text,elm){
    const key = data.key;
    return {
        sel,data,children,text,elm,key
    }
}
```
- h
```js
import vnode from "./vnode";

export default function(sel,data,c){
    if(arguments.length !== 3){
        throw new Error('入参错误')
    }

    // 根据第三个参数的类型「动态返回对象」
    if(typeof c =='string' || typeof c == 'number'){
        return vnode(sel,data,undefined,c,undefined)
    }else if(Array.isArray(c)){
        let children = [];
        for(let i = 0;i<c.length;i++){
            // 每一项必须是对象
            if(!(typeof c[i] == 'object' && c[i].hasOwnProperty('sel'))){
                throw new Error('数组内必须为h函数')
            }

            // 无需执行函数，将返回值收集放到「children」即可
            children.push(c[i]);
        }

        // 返回
        return vnode(sel,data,children,undefined,undefined)
    }else if(typeof c == 'object' && c.hasOwnProperty('sel')){
        let children = [c]
        return vnode(sel,data,children,undefined,undefined)
    }else{
        throw new Error('传入的第三个参数类型不对');
    }
}
```
