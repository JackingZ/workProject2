import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

// 保存用户反馈
export function saveFeedback(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/custFeedBack/uploadFile',
    method: 'post',
    data
  }
  return request(params)
}

// 获取用户反馈列表
export function getFeedbackList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/custFeedBack/page',
    method: 'post',
    data
  }
  return request(params)
}

// 删除用户反馈列表
export function delFeedback(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/custFeedBack/delete',
    method: 'post',
    params: data
  }
  return request(params)
}

// 获取反馈根据ID
export function getFeedBackById(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/custFeedBack/getFeedBackById',
    method: 'post',
    params: data
  }
  return request(params)
}

// 处理反馈
export function handleFeedback(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/custFeedBack/updateStatus',
    method: 'post',
    params: data
  }
  return request(params)
}
