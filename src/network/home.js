import axios from './axios'

export const BANNER = 'banner'
export const RECOMMEND = 'recommend'

// 请求轮播图的图片数据
export function getHomeMultidata() {
  return axios({
    url: '/home/multidata'
  })
}

//请求商品展示的图片数据
export function getHomeData(type, page) {
  return axios({
    url: '/home/data',
    params: {
      type,
      page
    }
  })
}
