// 测试 手写 h 函数
import h from "./mysnabbdom/h";

const Vnode2 = h('ul',{},[
    h('li',{},'苹果'),
    h('li',{},'苹果'),
    h('li',{},'苹果'),
    h('li',{},'苹果'),
])

console.log(Vnode2)