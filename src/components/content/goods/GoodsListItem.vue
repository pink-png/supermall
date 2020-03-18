<template>
  <div class="goods" @click="goToDetail" >
    <img v-lazy="getImg" :key="getImg" alt  @load="imageLoad"/>
    <div class="goods-info">
      <p>{{goods.title}}</p>
      <span class="price">¥{{goods.price}}</span>
      <span class="collect">{{goods.cfav}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "GoodsListItem",
  props: {
    goods: {
      type: Object,
      default: {}
    }
  },
  mounted: function() {
    // console.log(this.goods);
  },
  methods: {
    imageLoad: function() {
      // console.log("imageLoad")
      // 使用事件总线

      //因为这个组件是复用的。detail页面和home首页都用到了这个方法  所以我们需要进行一个判断
      // 方法一:使用路由的路径继续判断当时页面的url 来发送不同的事件
        // if(this.$route.path.indexOf('/home')){
        //   this.$bus.$emit("homeitemImageLoad");
        // }else{
        //   this.$bus.$emit("detailitemImageLoad");
        // }

        // 方法二:使用同一个方法 当点击到了detail页面的时候,也就是离开hme首页的时候，说明home首页不许要使用这个方法了
        // 可以在home首页的生命周期 取消这个事件
      this.$bus.$emit("itemImageLoad");
    },
    goToDetail: function() {
      // 1.获取iid
      let iid = this.goods.iid;

      // 2.跳转到详情页面
      this.$router.push({ path: "/detail", query: { iid } });
    }
  },
  computed: {
    getImg() {
      return this.goods.img || this.goods.image || this.goods.show.img;
    }
  }
};
</script>

<style scoped>
.goods {
  padding-bottom: 40px;
  position: relative;
  /* width: 48%; */
  flex: 48%;
}
.goods img {
  width: 100%;
}

.goods-info {
  font-size: 12px;
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  overflow: hidden;
  text-align: center;
}

.goods-info p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 3px;
}

.goods-info .price {
  color: var(--color-high-text);
  margin-right: 20px;
}

.goods-info .collect {
  position: relative;
}

.goods-info .collect::before {
  content: "";
  position: absolute;
  left: -15px;
  top: 0;
  width: 14px;
  height: 14px;
  background: url("~assets/img/common/collect.svg") 0 0/14px 14px;
}
</style>
