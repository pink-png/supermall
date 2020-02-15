<template>
  <div id="home">
    <nav-bar class="nav-bar">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control
      v-show="isTabFixed"
      class="fixed"
      @itemClick="tabClick"
      :titles="['流行', '新款', '精选']"
      ref="tabControl1"
    ></tab-control>

    <scroll
      class="content"
      ref="scroll"
      @scroll="contentScroll"
      @pullingUp="loadMore"
      :data="showGoodsList"
      :pull-up-load="true"
      :probe-type="3"
    >
      <div>
        <home-swiper :banners="banners" ref="hSwiper" @swiperImageLoad="swiperImageLoad"></home-swiper>
        <feature-view :features="recommends"></feature-view>
        <recommend-view></recommend-view>
        <tab-control @itemClick="tabClick" :titles="['流行', '新款', '精选']" ref="tabControl"></tab-control>
        <goods-list :goods-list="showGoodsList"></goods-list>
      </div>
    </scroll>

    <back-top @backTop="backTop" class="back-top" v-show="showBackTop">
      <img src="~assets/img/common/top.png" alt />
    </back-top>
  </div>
</template>

<script>
import NavBar from "common/navbar/NavBar";
import Scroll from "common/scroll/Scroll";
import TabControl from "content/tabControl/TabControl";
import BackTop from "content/backTop/BackTop";
import HomeSwiper from "./childComps/HomeSwiper";
import FeatureView from "./childComps/FeatureView";
import RecommendView from "./childComps/RecommendView";
import GoodsList from "./childComps/GoodsList";
import { getHomeMultidata, getHomeData, RECOMMEND, BANNER } from "network/home";
import { NEW, POP, SELL, BACKTOP_DISTANCE } from "@/common/const";

export default {
  name: "Home",
  components: {
    NavBar,
    Scroll,
    TabControl,
    BackTop,
    HomeSwiper,
    FeatureView,
    RecommendView,
    GoodsList
  },
  data() {
    return {
      banners: [],
      recommends: [],
      goodsList: {
        pop: { page: 1, list: [] },
        new: { page: 1, list: [] },
        sell: { page: 1, list: [] }
      },
      currentType: POP,
      isTabFixed: false,
      tabOffsetTop: 0,
      showBackTop: false,
      saveY: 0
    };
  },
  computed: {
    showGoodsList() {
      return this.goodsList[this.currentType].list;
    }
  },
  created() {
    // 1.请求多个数据
    this.getMultiData();

    // 2.请求商品数据
    this.getHomeProducts(POP);
    this.getHomeProducts(NEW);
    this.getHomeProducts(SELL);
  },
  destroyed() {
    console.log("销毁");
  },
  activated: function() {
    console.log("进入");
    this.$refs.hSwiper.startTimer();
  },
  deactivated: function() {
    console.log("离开");
    this.$refs.hSwiper.stopTimer();
  },
  updated() {
    // this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop
    // console.log(this.tabOffsetTop);
  },
  methods: {
    /**
     * 事件监听相关方法
     */
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = POP;
          break;
        case 1:
          this.currentType = NEW;
          break;
        case 2:
          this.currentType = SELL;
          break;
      }
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl.currentIndex = index;
    },
    contentScroll(position) {
      // 1.决定tabFixed是否显示
      this.isTabFixed = position.y < -this.tabOffsetTop;

      // 2.决定backTop是否显示
      this.showBackTop = position.y < -BACKTOP_DISTANCE;
    },
    loadMore() {
      this.getHomeProducts(this.currentType);
    },
    backTop() {
      this.$refs.scroll.scrollTo(0, 0, 300);
    },
    swiperImageLoad() {
      // console.log(this.$refs.tabControl.$el.offsetTop);
      this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop;
    },
    /**
     * 网络请求相关方法
     */
    getMultiData() {
      getHomeMultidata().then(res => {
        this.banners = res.data[BANNER].list;
        this.recommends = res.data[RECOMMEND].list;
        // 下次更新DOM时,获取新的tabOffsetTop值(不保险,可以在updated钩子中获取)
        this.$nextTick(() => {
          this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop;
        });
      });
    },
    getHomeProducts(type) {
      getHomeData(type, this.goodsList[type].page).then(res => {
        const goodsList = res.data.list;
        this.goodsList[type].list.push(...goodsList);
        this.goodsList[type].page += 1;

        // 上拉加载一次后,调用这个方法可以下一次上啦加载
        this.$refs.scroll.finishPullUp();
      });
    }
  }
};
</script>

<style scoped>
#home {
  position: relative;
  height: 100vh;
}

.nav-bar {
  background-color: var(--color-tint);
  font-weight: 700;
  color: #fff;
}

.content {
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}

.fixed {
  position: fixed;
  top: 44px;
  left: 0;
  right: 0;
}

.back-top {
  position: fixed;
  right: 10px;
  bottom: 60px;
}
</style>
