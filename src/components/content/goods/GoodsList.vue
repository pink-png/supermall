<template>
  <div class="view">
    <goods-list-item v-for="(item, index) in goodsList" :key="index" :goods="item"></goods-list-item>
  </div>
</template>

<script>
import GoodsListItem from "components/content/goods/GoodsListItem";

export default {
  name: "GoodsList",
  components: {
    GoodsListItem
  },
  props: {
    goodsList: {
      type: Array,
      default: []
    }
  }
};
</script>

<style scoped>
  .view{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
</style>
