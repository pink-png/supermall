<template>
  <swiper ref="swiper" v-if="banners.length">
    <swiper-item v-for="(item, index) in banners" :key="index">
      <a :href="item.link">
        <img :src="item.image" alt @load="imageLoad" />
      </a>
    </swiper-item>
  </swiper>
</template>

<script>
import { Swiper, SwiperItem } from "common/swiper";

export default {
  name: "HomeSwiper",
  components: {
    Swiper,
    SwiperItem
  },
  props: {
    banners: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      isLoad: false
    }
  },
  methods: {
    stopTimer() {
      this.$refs.swiper.stopTimer();
    },
    startTimer() {
      if (this.$refs.swiper) {
        this.$refs.swiper.startTimer();
      }
    },
    // 监听图片有没有完全加载
    imageLoad() {
      //定义一个变量isLoad 默认是false  
      if (!this.isLoad) { //当isLoad为true的时候发送事件给home首页
        this.$emit("swiperImageLoad")
        this.isLoad = true
      }
    }
  }
};
</script>

<style scoped>
</style>
