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
import GoodsList from "components/content/goods/GoodsList";
import { getHomeMultidata, getHomeData, RECOMMEND, BANNER } from "network/home";
import { NEW, POP, SELL, BACKTOP_DISTANCE } from "@/common/const";
import { debounce } from "../../common/utils";

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
      saveY: 0,
      itemImgListener: null
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

    console.log(this.banners);
    console.log(this.recommends);

  },
  mounted() {
    //监听item中的图片加载完成
    const refresh = debounce(this.$refs.scroll.refresh, 500);

    //对监听的事件进行保存
    this.itemImgListener = () => {
      refresh();
    };
    this.$bus.$on(
      "itemImageLoad",
      // console.log('加载完成啦')
      //加载完成图片后,调用refresh更新
      // this.$refs.scroll.refresh();
      this.itemImgListener
    );
  },
  destroyed() {
    // console.log("销毁");
  },
  activated: function() {
    // console.log("进入");
    this.$refs.hSwiper.startTimer();

    //获取位置并瞬间跳转到之前离开时候的位置
    this.$refs.scroll.scrollTo(0, this.saveY, 0);
    //然后再刷新这个页面
    this.$refs.scroll.refresh();
  },
  deactivated: function() {
    // console.log("离开");
    this.$refs.hSwiper.stopTimer();

    //记录home首页离开时候的位置
    this.saveY = -this.$refs.scroll.getScrollY();

    //取消全局事件的监听函数itemImgListener函数
    this.$bus.$off("itemImageLoad", this.itemImgListener);
  },
  updated() {
    this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop;
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
      //上拉加载更多并且把page传进去
      this.getHomeProducts(this.currentType);
    },
    backTop() {
      this.$refs.scroll.scrollTo(0, 0, 300);
    },
    swiperImageLoad() {
      // 当轮播图组件的图片加载完后,发送事件,获取组件tabControl距离顶部的距离
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
        // this.$nextTick(() => {
        //   this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop;
        // });
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
