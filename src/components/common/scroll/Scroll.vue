<template>
  <div ref="wrapper" class="action">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from "better-scroll";

export default {
  name: "Scroll",
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    data: {
      type: Array,
      default: () => {
        return [];
      }
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    },
    scrollx:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      scroll: {}
    };
  },
  mounted() {
    setTimeout(this.__initScroll, 20);
  },
  methods: {
    __initScroll() {
      // 1.初始化BScroll对象
      if (!this.$refs.wrapper) return;
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: true,
        pullUpLoad: this.pullUpLoad,
        scrollX:this.scrollX
      });

      // 2.将监听事件回调 监听滚动的位置
      if (this.probeType === 2 || this.probeType === 3) {
        this.scroll.on("scroll", pos => {
          this.$emit("scroll", pos);
        });
      }

      // 3.监听上拉到底部
      if (this.pullUpLoad) {
        this.scroll.on("pullingUp", () => {
          console.log("上拉加载");
          this.$emit("pullingUp");
        });
      }
    },
    refresh() {
      // console.log('00')
      this.scroll && this.scroll.refresh && this.scroll.refresh();
    },
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp && this.scroll.finishPullUp();
    },
    scrollTo(x, y, time) {
      this.scroll && this.scroll.scrollTo && this.scroll.scrollTo(x, y, time);
    },
    getScrollY() {
      return this.scroll ? this.scroll.getScrollY : 0;
    }
  },
  watch: {
    data() {
      setTimeout(this.refresh, 1000);
    }
  }
};
</script>

<style scoped>
.action{
  touch-action: none;
}
</style>
