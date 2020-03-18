<template>
  <scroll class="cart-list" ref="scroll">
    <div class="content">
      <cart-list-item v-for="item in cartList" :key="item.iid" :item-info="item"></cart-list-item>
    </div>
  </scroll>
</template>

<script>
import Scroll from "common/scroll/Scroll";
import CartListItem from "./CartListItem";

export default {
  name: "CartList",
  components: {
    Scroll,
    CartListItem
  },
  props: {
    cartList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  activated() {
    //进入组件
    this.$refs.scroll.refresh();
  }
};
</script>

<style scoped>
.cart-list {
  position: absolute;
  left: 0;
  right: 0;
  top: 44px;
  bottom: 92px;
  width: 100%;
}
</style>
