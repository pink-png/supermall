1.
项目文件夹分类
assets 资源文件夹
common 公共的 js 文件
commponents 下的 common 是复用的组件 content 是本次项目的业务组件
network 网络请求
store vuex 状态管理
view 视图文件

2.
上传到 git 的时候,没有把 node 的包传上去，但是下载回来的时候
需要运行 npm install 会把 package-lock.json 的配置下载回来

3.
vue-cli 里面看不到配置文件
自己的创建 vue.config.js
自己配置动态路径

4.
可复用组件 common -> tabbar 根据项目需求在 content 里面封装 mainTabbar 组件 在 APP.vue 引入

5.
网络请求部分 基于 promise 封装的 axios 封装 request.js 请求函数

6.
home(首页的编写)
在 views -> home -> 创建 childComps 文件夹用于存放 home 首页的组件
导航栏(可复用组件) common -> navbar(可复用组件) 直接在 home.vue 引入组件,采用具名插槽
轮播图(可复用组件) common -> swiper(可复用组件) childComps -> HomeSwiper.vue 直接在 home.vue 引入组件,通过数据请求到的 banners 数组里面的数据,通过父传子的方式,动态绑定数据传输
推荐栏 (不可复用组件) childComps -> recommendView.vue 直接在 home.vue 引入组件 通过数据请求到的 recommends 数组里面的数据,通过父传子的方式,动态绑定数据传输
本周流行(不可复用组件) childComps -> FeatureView.vue 直接在 home.vue 引入组件 采用图片的形式直接引入,没有请求数据
控制栏(业务中复用的组件) content -> tabControl

流行,新款,精选 采用 home 父传子的方式,动态的方式，不直接在 tabControl 写死

列表选中那个就改变状态
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

商品列表的的传输(业务中复用的组件) content -> goods
GoodsList 是整个大的盒子
GoodsListItem 是一个个商品图片个信息
在 home.vue 组件里面 created() 组件创建完了，赶紧发送网络请求 创建 goods 数据结构用于保存请求到的数据
通过父传子,把 home.vue 里请求到的 goods 里的数据传给 GoodList GoodList 再通过父传子的方式把数据传给 GoodsListItem,使用 v-for 把图片和文字信息展示出来

列表 切换 (流行,新款,精选)
首先 Home 传给 GoodList 的数据不能直接写死为 'pop'
在 TabControl.vue 通过 v-for 给每一个 div(流行,新款,精选)注册点击事件,把当前的 index 传到 home 组件 采用 switch 的方式控制

采用原生的滚动,会很卡
为了适配移动端的滚动效果 采用 Better-Scroll 这个框架
安装这个框架 npm install better-scroll --save

为了让项目不对这个 better-scroll 有很大的依赖
如果有一天这个框架不维护或者不能用了,
所以，封装一个 better-scroll 的组件

可复用组件 common -> scroll

ref 如果是绑定在组件中的，那么**this.\$ref.refanma**获取到的是一个组件对象
ref 如果是绑定在普通的元素中，那么**this.\$ref.refanma**获取到的是一个元素对象

style 里的 scoped 属性的意义
就是当前的 style 属性是有作用域,
当前已经有 content 这个类名，那么其它父子组件也有这个类名，是不会收到影响的

注意:组件声明钩子函数的时候
里面没写代码的话，也会报错，但是不会影响功能
报错信息
`[Vue warn]: Error in mounted hook: "TypeError: handlers[i].call is not a function"`

导航标签(业务可复用组件) content -> backtop
采用固定定位
监听点击事件做业务处理

常规操作是 backtop 的点击事件向 Home 组件发送事件,home 组件在向子组件 scroll 组件发送数据
但是这种操作有点麻烦

用以下方法来解决

原生的 DOM 元素 button div 等都是可以监听点击事件的,那么子组件呢？
经过测试发现是不可以直接监听的 哎！！！
但是 vue 有一个修饰符 native @事件.native
加上这个修饰符,就可以监听啦！！！

具体操作:
在 home 组件 1.在已经引入的 backtop 中设置点击事件 2.拿到 scroll 组件中(通过设置组件 ref="scroll") 3.在 home 组件中 使用 this.\$refs.scroll 拿到这组件对象


定义一个函数来操作导航标签
ES6 默认值语法
`scrollTo(x,y,time=300){`
`this.scroll.scrollTo(x, y, time);`
`}`
