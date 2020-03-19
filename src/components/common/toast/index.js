
import Toast from './toast'
const obj ={
}
obj.install = function(Vue){
    //vue是默认传过来的
    // console.log(Vue)
    // console.log(Toast.$el)  //undefined
    // document.body.appendChild(Toast.$el)

    // 正常操做
    //1.创件组件构造器
    const toastContrustor = Vue.extend(Toast)
    //2.new的方式，根据组件构造器 ,可以创建一个组件对象
    const toast = new toastContrustor() 
    //3.将组件对象，手动挂载到某一个元素上
    toast.$mount(document.createElement('div'))
    //4.toast.$el对应的就是div    
    document.body.appendChild(toast.$el)
    //5.在Vue组件的原型里面添加toast构造器
    Vue.prototype.$toast = toast
}
export default obj