import {request} from "./request";

export function getHomeMultidata() {
  return request({
    url: '/home/multidata'
  })
}

export function getHomeGoods(type,page){
  return request({
    url: '/home/data',
    params:{
      type,
      page
    }
  })
}








// 函数调用 -> 压入函数栈(保存函数调用过程中所有变量)
// 函数调用结束 -> 弹出函数栈(释放函数所有的变量)
// function test() {
//   const names = ['why', 'aaa']
// }
//
// test()
//
// test()


//数组怎么存放到另一个数组里面，注意不是将数据合并
//-- const q1=[];
//const num=[1,2,3];

//for (let n of num){
 // q1.push(n);
//}

//数组的解构赋值 -->
//<!-- num.push(...q1)


