import defineReactive from './defineReactive'
import Observer from './Observer'
import observe from './observe'
import Watcher from './Watcher'

const obj = {
    a:{
        m:{
            n:2
        }
    },
    b:3,
    c:[1,2,3,4,4]
}

observe(obj)

obj.b++
obj.c.push(5)

new Watcher(obj,'a.m.n',(val)=>{
    console.log("***",val)
})
obj.a.m.n = 3