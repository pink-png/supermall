1.
项目文件夹分类
assets 资源文件夹
common 公共的 js 文件
commponents 下的 common 是复用的组件 content 是本次项目的业务组件
network 网络请求
store vuex 状态管理
view 视图文件

2.
css 文件的引用
assets -> css -> normalize.css(初始化 css)
assets -> css -> base.css(自己的 css) 将 normalize 引入到 base.css( @import "./normalize.css")
将 base.css 引入到 App.vue( @import "assets/css/base.css" )
最后项目打包的时候是 main.js 主函数 找到 APP.vue 最后找到引入的 base.css
base.css 使用了 :root 获取根元素 html 定义 css 变量

3.
上传到 git 的时候,没有把 node 的包传上去，但是下载回来的时候
需要运行 npm install 会把 package-lock.json 的配置下载回来

4.
vue-cli 3.x 里面看不到配置文件
自己创建 vue.config.js 配置自己的 webpack 配置 最后和公共的 webpack 会合并的
自己配置的动态路径 就不需要写类似于 ../../ 这种恶心的写法了
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
使用 vue-cli 2.x 默认生成 editorconfig 目的是为了给代码做统一风格
vue-cli 3.x 可以自己创建这个文件来配置自己的代码做统一风格

5.
整个项目的骨架 tabbar
可复用组件 components -> common -> tabbar 根据项目需求在 content 里面封装 mainTabbar 组件 在 APP.vue 引入
创建路由 index.js 配置 tabbar 和路由的关系
`mode:history` history 模式的使用
路由懒加载的使用 => 为给客户更好的客户体验，首屏组件加载速度更快一些，解决白屏问题

6.
icon 图标的引入
public -> index.html (`<link rel="icon" href="<%= BASE_URL %>logo.png">`)
这是 jsp 的语法,为什么能被运行?
因为,最后这个 index.html 文件会被打包到 dist 文件夹下，不会存在这个语法了

---

7.
首页的开发

注意资源文件的引入需要在前面加 ~ 符号
首页 navbar 是可复用组件 预留三个具名插槽 每一个插槽外面包一个 div 使用 flex 布局设置样式

网络请求的封装 network -> axios.js
需要使用到 axios
安装 axios 指令 npm install axios --save

首页请求的网络封装 network -> home.js 只需要面向 axios.js 这个请求方法就可以了

当 home.vue 组件已经创建好的时候就发送网络请求 在 created 生命周期里请求 请求到的数据需要保存在 data 中
在 data 中定义 banners 和 recommend 2 个空的数组 存放各自请求得到的数据

轮播图组件的封装(也可以使用 swiper 插件) 可复用组件 components -> common -> swiper
swiper 作为轮播整体框架，swiperItem 作为每一个需要轮播的图,将首页 home 请求到的 banners 作为长度，循环创建需要轮播的图片张数个数的 swiperItem

为了体现组件化封装的思想，在 view -> home -> 创建 childComps 文件用于存放首页 home 的功能模块

业务公共组件 components -> content -> tabControl(流行，新款，精选)
直接传文字(流行，新款，精选) 给子组件 用于显示

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

商品列表的展示
设计数据保存的模型
变量 goods 保存着:(流行，新款，精选这三个数组)
page:页码
list:保存的数据数
对象:goods{
'pop':{page:默认 1,list:[]},
'news':{page:默认 1,list:[]},
'sell':{page:默认 1,list:[]}
}  
每当用户上拉加载更多的时候，page+1 list 的数量也跟着增加

考虑到首页 home 的 created 代码量的数量，把里面的方法封装到 methods 中，created 采用 this.方法来调用

商品的展示
采用 GoodsList 作为一个大的容器 存放每一个 GoodsListItem 每一个商品信息的方式 商品个数的数量循环 GoodlistITem 的数量

点击 TabControl 切换(流行，新款，精选)
给这个三个 tab 设置事件点击监听 但是当前只是在当前组件内的点击 ,跟外面是无关的
所以 要使用\$emit('function' , var)自定义事件方法来传递数据 传出的是什么呢？
是当前(流行，新款，精选)div 的序列 index 分别是 0 ，1 ，2
首页接收到的 idnex 序列 采用 switch 语法 来切换 显示的数据是 pop ， new 还是 sell

**以上 整个首页 大致的样子就差不多完成**

接下来考虑的是 滚动方面的
当项目部署到服务器上的时候，采用原生的滚动在移动端会非常的卡顿
早期解决这个问题  
采用 iscroll 来解决 但是由于年代久远 作者不跟新维护了，所以不采用
国内有一个人根据这个框架做了一个兼容 css3 的 better-scroll

better-scroll 是基于原生 js 实现的，不依赖任何框架 是非常好的选择

安装 npm install better-scroll --save(依赖)

对于整个首页来说 ,底部 tabbar 和顶部的 navbar 是不需要使用 better-scroll 对象来监听滚动的
对于这个 better-scroll 整个插件来说 整个项目里不只使用了一次
对于这个插件的维护性来说，某一天出了 bug 或者作者不维护了
所以 还是采用封装一个 scroll 组件 里面定义插槽的方式来使用这个插件
components -> common -> scroll 属于可复用组价

其实对于 vue better-scroll 正好非常的合适
因为 better 外层需要包装一个 wrapper 的一个 div 就相当于 scroll 组件
里面的内容就是 scroll 插槽 的内容 content

封装 scroll 组件
创建的 better 对象传入的对象 采取 ref 的方式来获取 如果用原生的方式可能有冲突 指不定拿到的是哪一个的，类名获取。是先拿到的是第一个元素对象
ref 如果是绑定在组件中的，那么通过**this.\$refs.refname** 获取到组件对象
ref 如果是绑定在普通元素中的，那么通过**this.\$refs.refname** 获取到元素对象

**考虑到业务中的上拉下拉获取或者监听的异同,里面的事件全部采用自定义事件的方式** home 组件或者是其他需要使用到 scroll 组件对其传值的方式来操作 scroll 组件

那么 content 的大小(需要滚动部分的大小)该怎么设置呢？
这里我采用
将它整个采用定位的方式
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

backTop 的封装
公共共业务组件 components -> content -> backTop
点击回到顶部的
也采用插槽的方式 插槽里面为点击回到顶部的图片

这里的业务效果是点击 backTop 这个组件,让 scroll 这个组里面分装的内容无论拉下哪里都要回到顶部

相当于在 home 首页组件里面 有 2 个不相干的 2 个兄弟组件 backtop 组价 操作 scroll 组件

最原始的思路就是 backtop 组件自定义事件往 home 组件发送 , 然后 home 组件接受到了 backtop 组件发来的事件,
然后在 home 组件里面拿到 scroll 组件 就是那个 ref 是 scroll 的组件 ，然后 `this.$refs.scroll.scrollTo(0, 0, 300)`

其实这样还不是太麻烦就这么干吧

**其实有一个更简单的办法** 就是直接在 home 组件里面 直接监听 backtop 的事件
但是组件能不能直接监听事件呢?
是不行的，需要使用到 vue.js 一个 .native 的一个指令
实现监听的方式可以改为 `<back-top @click.native="backClick"/>`
然后 直接就是在 backClick 里面拿到 scroll 组件 然后 `this.$refs.scroll.scrollTo(0, 0, 300)`

这里补充一下关于 **better-scroll 对象的点击事件**
如果是点击 div 的话 ,是要给 scroll 对象加上 click:true 的

**上拉加载更多的编写**
使用 better-scroll 在普通的上啦中是一点问题都没有的
但是 上啦加载请求数据就会出现 明明有数据加载过来 但是 不能够上啦的 bug

首先在普通的上啦下拉的时候，content 的高度是固定的，里面的内容也是固定的  
所以在内部可以滚动的距离就是里面内容的高度减去 content 的高度

但是在上啦加载更多数据的时候,  
better-scroll 在决定有多少区域可以滚动时,是根据 scrollHeight 属性决定的
scrollHeight 属性是根据 better-scroll 的 content 中的子组件的高度
但是在我们首页中,刚开始在计算 scrollHeight 属性时，是没有将图片计算在内的
所以计算出来的高度是错误的
后来图片加载进来之后有了新的高度，但是 scrollHeight 的属性时不会更新的
_怎么解决这个问题？_
监听每一张图片是否加载完成，只要有一张图片加载完成，执行一次 refresh()
_怎么监听图片加载完成了呢？_
在 dom 中有 img.onload=functon(){}
但是在 vue 里面不需要这个，有一个指令 @load="方法"
但是使用这个方法的话 就相当于在 GoodListItem 中调用 this.scroll.refresh()
哈哈哈 这两者根本毫无关系 等于说 scroll 组件传给 home home 传给 GoodList GoodList 传给 GoodListItem
这会相当的麻烦！！！

_这里可以使用 vuex_
GoodlistItem 关联 vuex vuex 又关联 home 首页

_也可以使用事件总线_ 他和 vuex 很相似 ，但是它不是用来管理状态的，是管理事件的
goodlistitem 使用 this.$bus.emit('aaa',参数)  发送到事件总线
home首页    使用  this.$bus.on('aaa',回调函数(参数)) 来接收这个事件
但是默认情况下这个$bus是没有值的
需要在main.js里面设置
Vue.prototype.$bus = new Vue()

但是有时候为什么没这个 bug 呢?
那就看内部请求的快慢了 当计算高度前,图片已经加载完成

对于 refesh 非常频繁的问题，进行防抖操作
防抖函数 等用户输入完成后再发送数据请求
减轻了服务器的压力 提高了性能  
防止短时间多次触发

这里我们采用在 scroll 组件里对 data 中的 bs 进行 watch 监听,采用单次定时器
watch 擅长处理的场景：一个数据影响多个数据
computed 擅长处理的场景：一个数据受多个数据影响

**tabcontrol 的吸顶效果**
必须先知道滚动到多少的时候,开始进行吸顶效果

在 data 中定义一个属性 tabOffsetTop 来监听 tabcontrol 组件距离顶部的距离
但是拿到组件是没有 offesttop 属性的
要拿到组价里元素对象，才能获取
其实，所有的组件都有一个属性\$el ，用于获取组件中的元素的
`this.$refs.tabControl.$el.offsetTop`

不能直接在 mounted 中获取 tabControl 的 OffsetTop,那么值是不真确的
因为当时可能图片都没加载完 所以要等所有的图片都要加载完,再计算
tabcontrol 上面的图片主要分为轮播图的图片和下面 2 个部分的图片发现，下面 2 个几乎不受影响，
如何正确的获取值？
要先监听 HomeSwiper 中的 img 的加载完成 @load
加载完成后，发出事件，在 home.vue 中，获取正确的值

为了不让 homeswiper 多次发出事件
可以使用 isLoad 的变量进行状态的记录

获取到值 offesttop 的值后，就要监听 tabcontrol 的事件了

当滑到 offestTop 的时候，停止，但是发现了一个问题，组价不见了，
下面的商品内容，会突然上移
所以再放一个 tabcontrol 组件，
`v-show="isTabFixed" class="fixed"`
当滑到 offestTop 的值的时候，显示出来, css 设置 固定定位

但是问题又来了,这个时候有 2 个 tabcontrol
当下拉的时候，点击中间的新款，但是回拉倒上面的时候，上面的还停留在流行
拿到这 2 个 tabcontrol 设置下点击后的值
`this.$refs.tabControl1.currentIndex = index;`
`this.$refs.tabControl.currentIndex = index;`

**离开 Home 首页记录状态和位置**
正常情况下，当用于切换页面的时候 ，再返回还是当初的模样
但是,发现，是不行的
当点击其他路由的时候，
home首页会调用 销毁destroyed的生命周期钩子函数

让home不要随意销毁掉 app.vue设置
`<keep-alive exclude="Detail">`
`<router-view></router-view>`
`</keep-alive>`

但是怎么保持原来的位置呢？
离开时，保存一个位置信息savey
进来时，将位置设置为原来保存的位置信息savey即可


**点击商品跳转到详情页**
新建一个 view -> detail 来存放这个详情页视图的编写

配置一个路由
然后后给每一个图片设置一个点击跳转路由的点击事件
路由传递参数
1.动态路由
2.query的方式
 `this.$router.push({path: '/detail', query: {iid}})`