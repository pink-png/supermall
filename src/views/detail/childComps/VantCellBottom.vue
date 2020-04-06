<template>
  <div class="cell">
    <van-cell is-link @click="showPopup">展示弹出层</van-cell>
    <van-popup v-model="show" position="bottom" :style="{ height: '50%' }">内容</van-popup>
  </div>
</template>

<script>
export default {
  name: "VantCellBottom",
  data() {
    return {
      show: false
    };
  },
  props: {
    sh: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    showPopup() {
      this.show = this.sh;
    }
  }
};
</script>

<style>
</style>