// 该函数目的是将入参包裹成对象返回

export default function (sel,data,children,text,elm){
    const key = data.key;
    return {
        sel,data,children,text,elm,key
    }
}