1.
项目文件夹分类
assets 资源文件夹
common 公共的js文件
commponents 下的common是复用的组件 content是本次项目的业务组件
network 网络请求
store vuex状态管理
view 视图文件


2.
上传到git的时候,没有把node的包传上去，但是下载回来的时候
需要运行 npm install 会把package-lock.json的配置下载回来

3.
vue-cli里面看不到配置文件
自己的创建vue.config.js
自己配置动态路径


4.可以复用的tabbar的组件的引入
配置相关的路由
和文件的动态路径得修改


5.导航栏复用组件的编写、
采用插槽封装NavBar.vue


6.封装axios网络请求函数
request.js


7.创建首页home的网络请求
home.js















