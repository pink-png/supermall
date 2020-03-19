**项目文件夹分类**
assets 资源文件夹
common 公共的 js 文件
commponents 下的 common 是复用的组件 content 是本次项目的业务组件
network 网络请求
store vuex 状态管理
view 视图文件

**css 文件的引用**
assets -> css -> normalize.css(初始化 css 样式库)
assets -> css -> base.css(项目的 css) 将 normalize 合并到 base.css( @import "./normalize.css")
将 base.css 引入到 App.vue( @import "assets/css/base.css" )
最后项目打包的时候是 main.js 主函数 找到 APP.vue 最后找到引入的 base.css
base.css 使用了 :root 获取根元素 html 定义项目中所需要的的 css 变量

**项目上传 github 不上传 node_modules 的包**
上传到 git 的时候,没有把 node 的包传上去，但是下载回来的时候
命令行运行 npm install 会把 package-lock.json 的配置下载回来

**vue-cli 3.x 里面看不到配置文件 但是如果需要自己配置呢？**
自己在根目录创建 vue.config.js 配置自己的 webpack 配置 项目编译后 最后会和公共的 webpack 会合并的
自己配置的动态路径 就不需要写类似于 ../../ 这种太过于麻烦的写法了
`module.exports = {`
`configureWebpack: {`
`resolve: {`
`alias: {`
`'components': '@/components',`
`'content': 'components/content',`
`'common': 'components/common',`
`'assets': '@/assets',`
`'network': '@/network',`
`'views': '@/views',`
`}`
`}`
`}`
`}`
使用 vue-cli 2.x 默认生成 editorconfig 目的是不同 IDE 中保持一致的代码风格
vue-cli 3.x 可以自己创建这个文件来配置自己的代码做统一风格

**整个项目的骨架 tabbar**
可复用组件 components -> common -> tabbar 根据项目需求在 content 里面封装 mainTabbar 组件 在 APP.vue 引入
创建路由 index.js 配置 tabbar 和路由的关系
`mode:history` 采用 history 模式
路由懒加载的使用 => 为给客户更好的客户体验，首屏组件加载速度更快一些，解决白屏问题

**icon 图标的引入**
public -> index.html (`<link rel="icon" href="<%= BASE_URL %>logo.png">`)
这是 jsp 的语法,为什么能被运行?
因为,最后这个 index.html 文件会被打包到 dist 文件夹下,会被编译成可以使用的语法

**首页的开发**
采用组件化封装的思想，在 view -> home -> 创建 childComps 文件用于存放首页 home 的功能模块
需要注意的是 vue 组件中 template 模板中的资源文件的引入需要在前面加 ~ 符号

- navbar 组件的封装和使用
  navbar 是可复用组件 components -> common -> navbar 一个插槽外面包一个 div 使用 flex 布局设置样式 预留三个具名插槽

- 网络请求的封装 network -> axios.js
  网络请求使用的是 axios
  安装 axios 指令 npm install axios --save(运行时依赖)
  这里考虑到的是封装一个 axios 网络请求函数并导出方式来使用
  考虑到现在框架库更新迭代很快,和代码可以减少优化的情况
  封装了一个 network -> axios.js 一个网络请求函数

- 发送网络请求拿到轮播图图片和并存放在首页组件 home 中
  network -> home.js 这里直接使用已经封装好并导出的 axios 发送网络请求拿到数据
  当 home.vue 组件已经创建好的时候就发送网络请求 可以在 created 生命周期里请求因为当执行到 created 生命周期的时候,data 里的数据已经可以操作了 请求到的数据需要保存在 data 中
  在 data 中定义 banners 和 recommend 2 个空的数组 存放各自请求得到的数据

- 轮播图组件的封装(也可以使用 swiper 插件)
  可复用组件 components -> common -> swiper
  swiper 作为轮播整体框架，swiperItem 作为每一个需要轮播的图,将首页 home 请求到的 banners 作为长度，循环创建需要轮播的图片张数个数的 swiperItem

- tabControl 的封装
  业务公共组件 components -> content -> tabControl
  直接在组件中传一个数组 给子组件 tabControl 显示

- 小功能:
  (流行，新款，精选)列表选中那个就改变状态
  `<div v-for="(item,index) in title"`
  `class="tab-control-item" :class="{active:index===currentIndex}" @click="itemClick(index)">`
  `<span>{{item}}</span>`
  `</div>`
  `data(){`
  `return{`
  `currentIndex:0`
  `}`
  `},`
  `methods:{`
  `itemClick(index){`
  `this.currentIndex = index;`
  `}`
  `}`

- 商品列表的展示
  首先通过已经封装好的网络请求方法请求到数据,
  因为有 3 个(流行，新款，精选这三个数组)
  所以需要在 created 中请求 3 次
  `this.getHomeProducts(POP);`
  `this.getHomeProducts(NEW);`
  `this.getHomeProducts(SELL);`
  因为这不是一下子就把所有的图片都请求过来的,用户下拉到一定程度的时候 page 会跟着加 1,会进行再加载后面更多的数据
  所以设计数据保存的模型用于存放数据和更新数据
  变量 goods 保存着:(流行，新款，精选这三个数组)
  page:页码
  list:保存的数据数
  对象:goods{
  'pop':{page:默认 1,list:[]},
  'news':{page:默认 1,list:[]},
  'sell':{page:默认 1,list:[]}
  }  
  考虑到首页 home 的 created 代码量的数量，把里面的方法封装到 methods 中，created 采用调用 method 里面的方法的方式

商品的展示
采用 GoodsList 作为一个大的容器 存放每一个 GoodsListItem 每一个商品信息的方式 商品个数的数量循环 GoodlistItem 的数量

点击 TabControl 切换(流行，新款，精选)
给这个三个 tab 设置事件点击监听 但是当前只是在当前组件内的点击 ,跟外面是无关的
所以 要使用\$emit('function' , var)自定义事件方法来传递数据 传出的是什么呢？
当前(流行，新款，精选)div 的序列 index 分别是 0 ,1 ,2
首页接收到的 idnex 序列 采用 switch 语法 来切换 显示的数据是 pop , new 还是 sell

- 接下来考虑的是 滚动方面的
  当项目部署到服务器上的时候，采用原生的滚动在移动端会非常的卡顿
  早期解决这个问题  
  采用 iscroll 来解决 但是由于年代久远 作者不跟新维护了，所以不采用
  国内有一个人根据这个框架做了一个兼容 css3 的 better-scroll
  better-scroll 是基于原生 js 实现的，不依赖任何框架 是非常好的选择

安装 npm install better-scroll --save(运行时依赖)

对于整个首页来说 ,底部 tabbar 和顶部的 navbar 是不需要使用 better-scroll 对象来监听滚动的

对于这个 better-scroll 整个插件来说在整个项目里不止使用了一次
对于这个插件的维护性来说,某一天出了 bug 或者 作者不维护了 都会对后面的项目造成影响
所以 还是采用封装一个 scroll 组件 里面定义插槽的方式来使用这个插件
components -> common -> scroll 属于可复用组件

其实对于 vue better-scroll 正好非常的合适
因为 better 外层需要包装一个 wrapper 的一个 div 就相当于 scroll 组件
里面的内容就是 scroll 插槽 的内容 content

- 封装 scroll 组件 可复用组件 components -> common -> scroll
  创建的 better 对象传入的对象 采取 ref 的方式来获取 如果用原生的方式可能有冲突 指不定拿到的是哪一个的,类名获取。是先拿到的是第一个元素对象
  ref 如果是绑定在组件中的，那么通过`this.$refs.refname` 获取到 _组件对象_
  ref 如果是绑定在普通元素中的，那么通过`this.$refs.refname`获取到 _元素对象_

考虑到业务中的上拉下拉获取或者监听的异同,scrll 采用自定义方法的方式来个使用这个 scroll 组件的组件提供接口

- 使用 scroll 组件将中间除了顶部 navbar 和底部 tabbar 中间的内容部分包起来
  使用 better-scroll 需要在设置 content 的高度
  那么 content 的大小(需要滚动部分的大小)该怎么设置呢？
  这里我采用
  将中间整个内容采用定位的方式
  `.content {`
  `position: absolute;`
  `top: 44px;`
  `bottom: 49px;`
  `left: 0;`
  `right: 0;`
  `}`
  navbar 高度是 44px
  tabber 高度是 49px
  左右距离为 0

这样就不需要设置宽高了 ，大小有内容来撑起

- backTop 的封装和使用
  公共共业务组件 components -> content -> backTop

采用插槽的方式 插槽里面为 backTop 的样式图片

这里的目的是点击 backTop 这个组件,让 scroll 这个组里面封装的内容无论拉下哪里都要回到顶部

怎么实现这里的交互功能呢？
相当于在 home 首页组件里面 有 2 个不相干兄弟组件 backtop 组价 操作 scroll 组件

方法一:
最原始的思路就是 backtop 组件自定义事件往 home 组件发送 , 然后 home 组件接受到了 backtop 组件发来的事件,
然后在 home 组件里面拿到 scroll 组件 就是那个 ref 是 scroll 的组件 ，然后使用 scroll 组件 `this.$refs.scroll.scrollTo(0, 0, 300)`
方法二:
就是直接在 home 组件里面 直接监听 backtop 的事件
但是组件能不能直接监听事件呢?
是不行的，需要使用到 vue.js 一个 .native 的一个指令
实现监听的方式可以改为 `<back-top @click.native="backClick"/>`
然后 直接就是在 backClick 里面拿到 scroll 组件 最后 `this.$refs.scroll.scrollTo(0, 0, 300)`

- 补充一下关于 better-scroll 对象的点击事件
  如果是点击 div 的话是要给 scroll 对象加上 click:true 的

首先在普通的上拉下拉的时候,content 的高度是固定的,里面的内容也是固定的  
所以在内部可以滚动的距离就是里面内容的高度减去 content 的高度

但是在上拉加载更多数据的时候,  
better-scroll 在决定有多少区域可以滚动时,是根据 scrollHeight 属性获取到的高度的

- 商品的展示
  采用大组件 GoodList 来包裹一个一个 GoodListItem 商品的方法
  在 GOOdlistItem 里设置需要的样式和需要展示的数据

- 商品上拉加载更多
  使用 better-scroll 在普通的上拉下滑是一点问题都没有的
  但是 上拉加载请求数据就会出现 明明有数据加载过来 但是 不能够向上滑决定的,就是卡住不能再往上滑动
  scrollHeight 属性是根据 better-scroll 的 content 中的子组件的高度计算的
  但是在我们首页中,刚开始在计算 scrollHeight 属性时,是没有将图片计算在内的
  所以计算出来的高度是错误的
  后来图片加载进来之后有了新的高度,但是 scrollerHeight 的属性时不会更新的

- 怎么解决这个问题？
  监听每一张图片是否加载完成，只要有一张图片加载完成,执行一次 refresh()

- 怎么监听图片加载完成了呢？
  在 Dom 中有 img.onload=functon(){}的方法
  但是在 vue 里面不需要这个,有一个指令 @load="方法"
  但是使用这个方法的话 就相当于在 GoodListItem 中调用 this.scroll.refresh()
  这两者根本毫无关系 等于说 scroll 组件传给 home , home 传给 GoodList , GoodList 传给 GoodListItem

简便方法一:
使用 vuex
GoodlistItem 关联 vuex vuex 又关联 home 首页

简便方法二:
使用事件总线 专门用于解决兄弟间通信的方法
他和 vuex 很相似,但是它不是用来管理状态的,是管理事件的
goodlistitem 使用 this.$bus.emit('aaa',参数)  发送到事件总线
home首页  使用  this.$bus.$on('aaa',回调函数(参数)) 来接收这个事件
但是默认情况下这个$bus 是没有值的
需要在 main.js 里面设置
Vue.prototype.\$bus = new Vue()

但是有时候为什么没这个 bug 呢?
那就看内部请求的快慢了 当计算高度前,图片已经加载完成

对于 refesh 非常频繁的问题,进行防抖操作
防抖函数
防抖函数起作用的过程：
如果我们直接执行 refresh,那么 refresh 函数会被执行 30 次
可以将 refresh 函数传入到 debounce 函数中，生成一个新的函数
之后在调用非常频繁的时候，就使用新生成的函数
而新生成的函数，并不会非常频繁的调用，如果下一次执行来的非常快,那么会将上一次取消掉
好处就是: 1.减轻了服务器的压力 提高了性能  
2.防止短时间多次触发

watch 擅长处理的场景：一个数据影响多个数据
computed 擅长处理的场景：一个数据受多个数据影响

- tabcontrol 的吸顶效果
  必须先知道滚动到页面中的什么位置,才开始进行吸顶效果

动态改变样式：
在 data 中定义一个属性 tabOffsetTop 来监听 tabcontrol 组件距离顶部的距离
但是拿到组件是没有 offesttop 属性的
要拿到组件里元素对象,才能获取
其实，所有的组件都有一个属性\$el,用于获取组件中的元素的

不能直接在 mounted 中获取 tabControl 的 OffsetTop,那么值是不真确的
因为当时可能图片都没加载完 所以要等所有的图片都要加载完,再计算
tabcontrol 上面的图片主要分为轮播图的图片和下面 2 个部分的图片发现，下面 2 个几乎不受影响，
如何正确的获取值？
要先监听 HomeSwiper 中的 img 的加载完成 @load
加载完成后，发出事件，在 home.vue 中，获取正确的值

为了不让 homeswiper 多次发出事件
可以使用 isLoad 的变量进行状态的记录

获取到值 offesttop 的值后，就要监听 tabcontrol 的事件了

当滑到 offestTop 的时候，停止，但是发现了一个问题，组件不见了，
下面的商品内容，会突然上移
所以再放一个 tabcontrol 组件，
`v-show="isTabFixed" class="fixed"`
当滑到 offestTop 的值的时候，显示出来, css 设置 固定定位

但是问题又来了,这个时候有 2 个 tabcontrol
当下拉的时候，点击中间的新款，但是回拉倒上面的时候，上面的还停留在流行
拿到这 2 个 tabcontrol 设置下点击后的值
`this.$refs.tabControl1.currentIndex = index;`
`this.$refs.tabControl.currentIndex = index;`

- 离开 Home 首页记录状态和位置\_
  正常情况下，当用于切换页面的时候 ，再返回还是当初的模样
  但是,发现是不行的
  当点击其他路由的时候，
  home 首页会调用 销毁 destroyed 的生命周期钩子函数

让 Home 首页 不要随意销毁掉 app.vue 设置
`<keep-alive>`
`<router-view></router-view>`
`</keep-alive>`

但是怎么保持原来的位置呢？
离开时(生命周期函数 deactivated)，保存一个位置信息 savey
进来时(生命周期函数 activated)，将位置设置为原来保存的位置信息 savey 即可
最后需要调用 refresh 函数进行刷新

**点击商品跳转到详情页**
新建一个 view -> detail 来存放这个详情页视图的编写

配置一个路由
然后后给每一个图片设置一个点击跳转路由的点击事件
路由传递参数 1.动态路由
2.query 的方式
`this.$router.push({path: '/detail', query: {iid}})`

- 轮播组件 DetailSwiper
  在 detail 中的 create 生命周期发送网路请求接受到的数据采用父传子的方式传给 DetailSwiper 组件
  采用循环的方式把图片传给当前的组件
  引入 swiper 轮播组件 展示图片
  设置 css 样式

但是出了一个 bug 就是 点击首页中的商品图片跳转到详情页都是第一次跳转的图片
因为之前为了保存离开首页的进度 就是没进行 destroyed 销毁生命周期函数
采用 keep-alive 给 router-view 保存了
当点击图片后，内部都不会再更新了
那怎么才能让 detail 这个组件不使用 keep-alive 呢？
就需要使用 exclide 这个属性了 排除 Detail 这个页面
`<keep-alive exclude="Detail">`
`<router-view></router-view>`
`</keep-alive>`

- 商品基本信息的展示 DetailBaseInfo
  这里需要注意的是：
  数据杂乱无章
  从 detail 页面 拿到的数据不要一个一个传给 DetailBaseInfo 页面 把数据整合成一个对象
  类似于构造类的方式
  class Person{
  costructor(name,age){
  this.name=name;
  this.age=age;
  }
  }
  const p = new Person('name',1000);

在 network -> detail.js 请求的 detail 数据中 采用构造类的方法
保存一个对象，这个对象里面保存请求下来的数据

`<div v-if="Object.keys(goods).length !== 0" class="base-info">`
这段代码的含义是 查看传过来的 goods 对象是否为空 空的话就不展示

- 商家信息的展示 DetailShopInfo
  采用跟商品基本信息类似的实现方法

- 详情页的滚动采用 better-scroll 插件
  这里注意 content 需要设置高度

- 穿着效果图片的展示 DetailGoodInfo
  这里如果直接加载来图片 每一张图片都会影响高度的计算
  这里进行一层判断
  `methods: {`
  `imgLoad() {`
  `if (++this.counter === this.imagesLength) {`
  `this.$emit("imageLoad");`
  `}`
  `}`
  `},`
  `watch: {`
  `detailInfo() {`
  `this.imagesLength = this.detailInfo.datailImage[0].list.length;`
  `}`
  `}`
  定义一个 counter 计数器来计数图片的数量 当 counter 等于所有图片数量等于的时候，说明已经全部加载了，
  再 emit 出一个事件
  注意,刷新调用 scroll 组件
  `this.$refs.scroll.refresh()`

- 商品参数的展示 DetailparmInfo
  采用构造函数的对象的方式来存放数据

- 商品评论 derailCommentInfo
  只要是服务器返回的是时间
  不会是以 xxxx-y-zz aa:bb:cc 这种格式的
  是一串数字或者是其它的 一串时间戳 比如 153567434(毫秒)
  怎么将时间戳格式化时间格式化字符串 1.将时间戳转成 Date 对象
  const data = new Date(153567434\*1000) 2.将 data 进行格式化，转成对应的字符串

封装一个事件格式化的方法 common -> utils

- 标题和内容的联动效果
  监听 DetailNavBar 的点击
  发出点击事件
  然后在 detail 中调用 this.\$refs.scroll.scrollTo()
  那其中 y 的值怎么获取呢？

定义一个 themeTops 的一个数组用于存放 y 的值
其实就是获取上面组件(param comment recommend base)的 offsettop 的值
那么在哪里获取这个值呢？
created？ mounted ？ 还是其它的生命周期？
created 肯定不行，压根不能获取元素
在 mounted 取值发现,是不准确的，
因为在这几个组件中做了一层 object.key().length 没有值的时候不渲染页面
这里需要注意 组件拿到数据后，需要时间渲染
可以在 mounted 生命周期中使用 this.$nextTick(()=>{})来获取准确的值
但是这个方法会有问题，
this.$nextTick()
是根据最新的数据，对应的 DOM 是已经渲染出来的
但是图片依然是没有加载完(目前获取到的 offsettop 不包含其中的图片
offsetTop 值不对的时候，都是图片的问题
这个时候就可以在 updated 数据更新后的生命周期里面获取了

- 点击商品加入购物车
  点击添加购物车
  在 detailBottomBar 中发送事件给 detail 组件
  将当前数据整合成一个对象

使用 Vuex 进行管理
安装 npm install vuex --save

添加商品怎么加呢？
是对每一种不同的商品进行点击加 1
使用 find 方法进行判断是否添加过商品
**购物车**

- 创建 view -> Cart
  创建组件 DetailBottomBar -> 最主要的是点击加入购物车
  给加入购物车创建点击事件
  方法 1.可以使用子传父的方式
  方法 2.监听组件的 native 方式

- 点击加入购物车的数据来自哪里？
  vuex 对象 可以实现共享数据  
   管理的 state 对象中的 cartList 数组
  cartList：[{商品 1},{商品 2},{商品 3} ...]的方式存放商品信息

  这里在注意的是不要直接在 state 中把数据 push 到 state 中
  这里注意的是修改 vuex store 中的数据要在 mutations 中
  mutations 唯一的作用就是修改 state 中的状态
  mutations 中的每一个方法尽可能完成的事件比较单一一点

  在 mutaions 中封装一个 addCart 函数用于判断是否已经添加过该商品,没有的话添加,添加过得话就数量加 1
  `addCart(state, info) {`
  `const oldInfo = state.cartList.find(item => item.iid === info.iid)`
  `if (oldInfo) {`
  `oldInfo.count += 1`
  `} else {`
  `info.count = 1`
  `info.checked = true`
  `state.cartList.push(info)`
  `}`
  `}`

- 采用 better-scroll 实现滚动效果
  每次点击添加后，购物车页面的 scroll 里面的长度会增加,若不更新的话，会存在页面无法滚动的情况
  所以每次点击后 CartList 组件在进入组件 activated 的生命周期里调用 scroll 组件的 refresh 函数

- 商品的选中和不选中的切换
  创建组件 CheckButton 小按钮用于显示 是否选中
  这里注意：
  修改的是数据模型对象 cartlist 里的 checked 的布尔值来判断是否选中

- 底部工具栏的汇总
  全选按钮
  计算价格
  去付款

- 购物车的全选按钮
  显示的状态:
  判断是否有一个不选中，全选按钮就是不选中
  `isSelectAll: function() {`
  `return (`
  `this.$store.getters.cartList.find(item => item.checked === false) === undefined`
  `);}`
  点击全选按钮
  所有的按钮都选中

- 弹窗功能
  可复用组件 components -> common -> toast
  这里并不是直接在 detail 中的监听加入购物车里直接显现该按钮，而是真正加入购物车了再显示
  那怎么才能知道是否加入了呢？
  可以根据 this.\$store.dispath 返回的 promise 对象

  组件 toast 位置居中
  `position: fixed;`
  `top: 50%;`
  `left: 50%;`
  `transform: translate(-50%,-50%);`

  但是鉴于其他地方可能也需要用到这个 toast
  这里对它进行封装一个插件
  其实就是封装一个节点
  第一步: components -> common -> toast -> index.js
  第二步: mian.js 里面导入这个 js 文件
  第三步:使用 Vue.use()安装这个插件
  第四步: 在 index.js 里面进行相关操作

`import Toast from './toast'`
`const obj ={`
`}`
`obj.install = function(Vue){`
`//vue是默认传过来的`
`// console.log(Vue)`
`// console.log(Toast.$el) //undefined`
`// document.body.appendChild(Toast.$el)`

`// 正常操做`
`//1.创件组件构造器`
`const toastContrustor = Vue.extend(Toast)`
`//2.new的方式，根据组件构造器 ,可以创建一个组件对象`
`const toast = new toastContrustor()`
`//3.将组件对象，手动挂载到某一个元素上`
`toast.$mount(document.createElement('div'))`
`//4.toast.$el对应的就是div`
`document.body.appendChild(toast.$el)`
`//5.在Vue组件的原型里面添加toast构造器`
`Vue.prototype.$toast = toast`
`}`
`export default obj`
**减少移动端 300ms 的延迟**

- 移动设备上的浏览器默认会在用户点击屏幕大约延迟 300 毫秒后才会触发点击事件，这是为了检查用户是否在做双击。为了能够立即响应用户的点击事件，才有了 FastClick

  安装 npm install fastclick --save(开发时依赖)

  在 main.js 里面导入并调用 attach 这个方法
  `// 导入fastclick这个库`
  `import FastClick from 'fastclick'`

  `//使用fastclick解决300ms的延迟`
  `FastClick.attach(document.body)`
  **图片懒加载**

- 图片显示在需要在屏幕上时候再加载
  需要用到的时候再加载

  安装 npm install vue-lazyload --save

  在 main.js 里面引入这个插件
  安装 Vue.use()这个插件
  修改 img.src -> v-lazy

  **css 单位转化插件**

- 安装 npm install postcss-px-to-viewport --save-dev
  修改 postcss.config.js 这个文件
