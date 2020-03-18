<template>
  <div id="cart">
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{cartCount}})</div>
    </nav-bar>
    <cart-list  :cart-list="cartList"></cart-list>
    <bottom-bar></bottom-bar>
  </div>
</template>

<script>
import NavBar from "common/navbar/NavBar";
import CartList from "./childComps/CartList";
import BottomBar from "./childComps/BottomBar";

import { mapGetters } from "vuex";

export default {
  name: "Cart",
  components: {
    NavBar,
    CartList,
    BottomBar
  },
  computed: {
    // 方法一：
    // cartList() {
    //   return this.$store.getters.cartList
    // },
    // cartCount() {
    //   return this.$store.getters.cartCount
    // }

    // 方法二
    //用法一：
    ...mapGetters(["cartList", "cartCount"])
    //用法二： 自己定义一个键值对的方式来定义这个属性
    // ...mapGetters({
    //   lenght:'cartCount',
    //   list:'cartList'
    // })
  }
};
</script>

<style scoped>
#cart {
  /* position: relative; */
  height: 100vh;
}

.nav-bar {
  background-color: var(--color-tint);
  font-weight: 700;
  color: #fff;
}

</style>
