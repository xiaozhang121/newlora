import axios from 'axios'
import { Base64 } from 'js-base64'
import user from '@/store/module/user.js'
import configIndex from '@/config'
import { Loading } from 'element-ui'
import store from '@/store'
let loadingInstance = null
class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json;charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest'
      },
      credentials: 'same-origin',
      withCredentials: true
    }
    if (user.state.token) {
      config.headers.Authorization = user.state.token
    }
    return config
  }
  distroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // 加载停止
      // if(!(url.indexOf('/lenovo-visible/api/visible-equipment/ptz/direction-adjust')>-1) && !(url.indexOf('device/temperature')>-1)){
          try{
              loadingInstance.close()
          } catch (e) {}
      // }
    }
  }
  interceptors (instance, url) {
    const that = this
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(that.queue).length) {
        // 加载开始
        // if(!(url.indexOf('/lenovo-visible/api/visible-equipment/ptz/direction-adjust')>-1) && !(url.indexOf('device/temperature')>-1) && !(url.indexOf('/lenovo-robot/rest/taskStatus')>-1) && !(url.indexOf('/lenovo-robot/rest/taskCurLink')>-1) && !(url.indexOf('/lenovo-robot/rest/robotStatus')>-1) && !(url.indexOf('/lenovo-robot/rest/specialTasks')>-1)){
          if(url.indexOf('lenovo-device/api/device/diagram/list')>-1){
              loadingInstance = Loading.service({
                  lock: true,
                  text: '加载中...',
                  spinner: 'el-icon-loading',
                  background: 'rgba(0, 0, 0, 0)'
              })
           }
        // }
      }
      that.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.distroy(url)
      const body = res.data || res
      const code = body.errorCode || body.status || 101010
      // console.log('返回参数的类型=', typeof body)
      if ((typeof body === 'string' && !code) || code == 101010) {
        const data = body
        return { data }
      }
      if (code === 200) {
        const resData = body.data || body.result
        const data = JSON.parse(JSON.stringify(resData))
        const msg = body.errorMessage
        return { data, code, msg }
      }
      if (code === 40101 || code == 40102) {
        store.dispatch('handleLogOut').then(res=> {
          window.location.href = '/login'
        })
      }
      if (code !== 200) {
        const data = body.data || body.result
        const msg = body.errorMessage
        return { data, code, msg }
      }
    }, error => {
      this.distroy(url)
      console.log('网络故障')
      return new Promise((resolve, reject) => {
        if (error.request.status === 401) {
          console.log('401')
        } else if (error.request.status === 500) {
          console.log('500')
        } else {
          console.log('404')
        }
        reject(error)
      })
    })
  }
  request (options) {
    const instance = axios.create()
    let data = {}
    if (options.params || options.data) {
      let dataObj = options.params ? options.params : options.data
      if (!(options.data instanceof FormData)) {
        data = Object.assign(dataObj, dataObj)
        // if (options.method === 'post' || options.method === 'put') {
        //   if (!configIndex.isMock || process.env.NODE_ENV !== 'development') {
        //     data = Base64.encode(JSON.stringify(data))
        //   }
        // }
      } else {
        data = dataObj
      }
    }
    if (options.method === 'get') {
      options.params = data
    } else {
      options.data = data
    }
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
