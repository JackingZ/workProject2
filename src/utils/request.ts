import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import { trimParams } from '@/utils/index'
// const APP_VER: string | undefined = process.env.VUE_APP_VER
const BASE_API: string | undefined = process.env.VUE_APP_BASE_API
const baseURL: string | undefined = `${BASE_API}`
// 接口报错不提示路径白名单
const stopTooltipList = [
  '/setting/msg_notice/queryAll',
  '/setting/msg_notice/getRotationNotice',
  '/orders/dashboard/dashboardQuery',
  '/orders/dashboard/planSummary',
  '/orders/fullorder/audit'
]
const isShowTooltip = (url: any) => {
  return stopTooltipList.every(wUrl => url.indexOf(wUrl) === -1)
}

const service = axios.create({
  baseURL, // url = base url + request url
  timeout: 30 * 1000
  // withCredentials: true // send cookies when cross-domain requests
})

// Request interceptors
service.interceptors.request.use(
  config => {
    // Add X-Access-Token header to every request, you can add other custom headers here
    if (UserModule.token && !config.headers['Authorization']) {
      config.headers['Authorization'] = 'Bearer ' + UserModule.token
      config.headers['X-Language'] = AppModule.language
    }
    config.data = trimParams(config.data)
    config.params = trimParams(config.params)
    return config
  },
  error => {
    Promise.reject(error)
  }
)

// Response interceptors
service.interceptors.response.use(
  response => {
    // Some example codes here:
    // code == 20000: success
    // code == 50001: invalid access token
    // code == 50002: already login in other place
    // code == 50003: access token expired
    // code == 50004: invalid user (user not exist)
    // code == 50005: username or password is incorrect
    // You can change this part for your own usage.
    const res = response.data
    if (response.config.responseType === 'blob') return res
    if (response.config.url && response.config.url.indexOf('importQuote') !== -1) {
      return res
    }
    if (res.code !== 200) {
      if (response.config.url && isShowTooltip(response.config.url)) {
        Message({
          message: res.msg || 'Error',
          type: 'error',
          duration: 3 * 1000
        })
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    const response = error.response
    if (error.response.status === 401) {
      UserModule.ResetToken()
      Message({
        message: '登录失效，请重新登录!',
        type: 'error',
        duration: 1000
      })
      setTimeout(() => {
        window.location.reload()
      }, 150)
    } else {
      if (response.config.url && isShowTooltip(response.config.url)) {
        if (error.response.config.responseType !== 'blob') {
          Message({
            message: error.response.data.message || error.response.data.msg,
            type: 'error',
            duration: 5000
          })
        }
      }
    }
    // console.warn(error.response)
    return Promise.reject(error.response)
  }
)

export default service
