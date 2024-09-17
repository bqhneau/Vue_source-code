import { init } from 'snabbdom/init';
import { classModule } from 'snabbdom/modules/class';
import { propsModule } from 'snabbdom/modules/props';
import { styleModule } from 'snabbdom/modules/style';
import { eventListenersModule } from 'snabbdom/modules/eventlisteners';
import { h } from 'snabbdom/h';

// 创建 patch 函数
const patch = init([classModule,propsModule,styleModule,eventListenersModule]);

// 创建虚拟节点
const Vnode = h('a',{
    props:{
        href:'https://www.atguigu.com',
        target:'_black'
    }
},'尚硅谷');

// h函数可以嵌套
const Vnode2 = h('ul',{},[
    h('li','苹果'),
    h('li','苹果'),
    h('li','苹果'),
    h('li','苹果'),
])

// 让虚拟节点上树
const container = document.getElementById('container');
patch(container,Vnode2)