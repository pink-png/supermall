import {
  ADD_COUNTER,
  ADD_TO_CART
} from './mutations-type'

const mutations = {
  [ADD_COUNTER](state, info) {
    info.count++
  },
  [ADD_TO_CART](state, info) {
    state.cartList.push(info)
  }
}

export default mutations
