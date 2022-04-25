import request from '@/utils/request'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

// 获取列表
export function getLineGroupList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/lsc/getLscGroupList',
    method: 'post',
    data
  }
  return request(params)
}
// 保存组
export function saveLscGroup(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/lsc/saveLscGroup',
    method: 'post',
    data
  }
  return request(params)
}
export function getLscGroupItems(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/lsc/getLscGroupItems',
    method: 'get',
    params: data
  }
  return request(params)
}
export function setLscGroupStatus(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/lsc/setLscGroupStatus',
    method: 'post',
    params: data
  }
  return request(params)
}
// 删除
export function deleteLscGroup(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/lsc/deleteLscGroup',
    method: 'delete',
    params: data
  }
  return request(params)
}

export function getServiceSubtypeList(data:any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/type/getServiceSubtypeList',
    method: 'GET',
    params: data
  }
  return request(params)
}

export function getCountryList(): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/setting/area/getCountryList',
    method: 'get'
  }
  return request(params)
}

export function getLscComplicatedList(data: any): AxiosPromise<any> {
  const params: AxiosRequestConfig = {
    url: '/cfg/lsc/condition',
    method: 'post',
    data
  }
  return request(params)
}
