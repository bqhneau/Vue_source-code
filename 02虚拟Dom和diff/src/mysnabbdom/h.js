// 低配版 h函数 => 只接受三个参数,有如下三种形态
// 形态① h('div', {}, '文字')
// 形态② h('div', {}, [])
// 形态③ h('div', {}, h())

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