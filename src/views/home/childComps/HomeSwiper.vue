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
      //console.log("--------"); //输出四次  ，因为有4张轮播图片
      if (!this.isLoad) {
        this.$emit("swiperImageLoad")
        this.isLoad = true
      }
    }
  }
};
</script>

<style scoped>
</style>
