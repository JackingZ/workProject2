import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'
import qs from 'qs'

// 用户登录
export function login(data: {
  username: string
  password: string
  [propName: string]: any
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/oauth/token',
    method: 'post',
    data: qs.stringify(data)
  }
  return request(params)
}
// 用户登录
export function logout(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/oauth/logout',
    method: 'post'
  }
  return request(params)
}

// 获取用户信息
export function getUserInfo(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/user/getUserInfo',
    method: 'get'
  }
  return request(params)
}

// 获取用户信息
export function changePassword(data: {
  newPassword: string
  oldPassword: string
}): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/auth/user/changePassword',
    method: 'post',
    params: data
  }
  return request(params)
}
