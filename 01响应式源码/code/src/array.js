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
    def(arrayMethods, methodName, function () {
        // 保证函数的「this」正常
        const res = origin.apply(this, arguments);


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

        // 派发更新
        ob.dep.notify()

        return res
    }, false)
});
