import {
  ADD_COUNTER,
  ADD_TO_CART
} from './mutations-type'

const actions = {
  addCart(context, info) {
    return new Promise((resolve, reject) => {
      // console.log(info);
      // 1.根据iid查看是否添加过
      const oldInfo = context.state.cartList.find(item => item.iid === info.iid)

      // 2.数量+1或者新添加
      if (oldInfo) {
        context.commit(ADD_COUNTER, oldInfo);
        resolve('当前商品数量+1');
      } else {
        info.count = 1;
        info.checked = true;
        // state.cartList.push(info)
        context.commit(ADD_TO_CART, info);
        reject('添加了新的商品');
      }
    }).catch((e)=>{console.log(e)})
  }

}

export default actions
